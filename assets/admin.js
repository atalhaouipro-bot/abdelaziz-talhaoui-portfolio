
/* =========================================================
   FORMA LAB / ABDELAZIZ TALHAOUI — ADMIN CMS
   File: assets/admin.js
   Backend: Supabase
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     1. CONFIGURATION
     --------------------------------------------------------- */

  const SECTION_LABELS = {
    settings: "Paramètres généraux",
    profile: "Profil",
    loop: "Présentation",
    categories: "Catégories",
    expertises: "Expertises",
    experiences: "Expériences",
    projects: "Projets",
    achievements: "Réalisations",
    research: "Recherche",
    productions: "Productions",
    tools: "Outils",
    formalab: "FORMA LAB",
    links: "Liens"
  };

  const FIELD_LABELS = {
    title: "Titre",
    subtitle: "Sous-titre",
    description: "Description",
    name: "Nom",
    role: "Fonction",
    headline: "Accroche professionnelle",
    email: "E-mail",
    phone: "Téléphone",
    location: "Localisation",
    website: "Site web",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    github: "GitHub",
    image: "Image",
    photo: "Photo",
    logo: "Logo",
    url: "URL",
    link: "Lien",
    date: "Date",
    year: "Année",
    company: "Organisation",
    organization: "Organisation",
    position: "Poste",
    institution: "Établissement",
    degree: "Diplôme",
    category: "Catégorie",
    type: "Type",
    status: "Statut",
    order: "Ordre",
    visible: "Visible",
    featured: "Mis en avant",
    skills: "Compétences",
    tags: "Mots-clés",
    content: "Contenu",
    text: "Texte",
    label: "Libellé",
    button: "Bouton",
    cta: "Appel à l’action",
    cv: "CV",
    cvUrl: "URL du CV",
    cv_url: "URL du CV",
    tagline: "Signature",
    slogan: "Slogan",
    specialty: "Spécialité",
    objective: "Objectif",
    mission: "Mission",
    results: "Résultats",
    tools: "Outils",
    languages: "Langues",
    fr: "Français",
    en: "Anglais",
    ar: "Arabe",
    startDate: "Date de début",
    endDate: "Date de fin",
    current: "Poste actuel"
  };

  const supabase = window.supabaseClient;

  let currentData = {};
  let currentSection = null;
  let currentUser = null;
  let savedSnapshots = {};
  let savingSections = new Set();
  let adminInitialized = false;
  let isLoading = false;

  /* ---------------------------------------------------------
     2. GENERAL HELPERS
     --------------------------------------------------------- */

  function clone(value) {
    if (value === undefined) return undefined;

    try {
      return structuredClone(value);
    } catch {
      return JSON.parse(JSON.stringify(value));
    }
  }

  function isObject(value) {
    return value !== null &&
      typeof value === "object" &&
      !Array.isArray(value);
  }

  function isPrimitive(value) {
    return value === null ||
      ["string", "number", "boolean"].includes(typeof value);
  }

  function labelize(key) {
    if (FIELD_LABELS[key]) return FIELD_LABELS[key];

    return String(key)
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, character => character.toUpperCase());
  }

  function languageLabel(language) {
    const labels = {
      fr: "Français",
      en: "Anglais",
      ar: "Arabe"
    };

    return labels[language] || language;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function showStatus(message, type = "info", container) {
    const target = container ||
      document.getElementById("editorStatus") ||
      document.getElementById("loginStatus");

    if (!target) {
      console.log(`[Admin ${type}] ${message}`);
      return;
    }

    target.textContent = message;
    target.dataset.type = type;
    target.className = `admin-status admin-status-${type}`;
    target.hidden = false;
  }

  function clearStatus(container) {
    if (!container) return;

    container.textContent = "";
    container.hidden = true;
  }

  function snapshot(section) {
    return JSON.stringify(currentData[section]);
  }

  function isDirty(section) {
    if (!Object.prototype.hasOwnProperty.call(currentData, section)) {
      return false;
    }

    return snapshot(section) !== savedSnapshots[section];
  }

  function hasUnsavedChanges() {
    return Object.keys(currentData).some(isDirty);
  }

  function confirmDiscard(section) {
    if (!isDirty(section)) return true;

    return window.confirm(
      `La section « ${SECTION_LABELS[section] || section} » contient ` +
      "des modifications non enregistrées.\n\n" +
      "Veux-tu vraiment quitter cette section sans les enregistrer ?"
    );
  }

  function confirmLeaveAdmin() {
    if (!hasUnsavedChanges()) return true;

    return window.confirm(
      "Certaines modifications ne sont pas enregistrées.\n\n" +
      "Veux-tu vraiment quitter l’administration ?"
    );
  }

  window.addEventListener("beforeunload", event => {
    if (hasUnsavedChanges()) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  /* ---------------------------------------------------------
     3. PATH HELPERS
     --------------------------------------------------------- */

  function parsePath(path) {
    return String(path)
      .split(".")
      .filter(Boolean)
      .map(part => /^\d+$/.test(part) ? Number(part) : part);
  }

  function setPathValue(object, path, value) {
    const parts = parsePath(path);

    if (!parts.length) return;

    let target = object;

    for (let index = 0; index < parts.length - 1; index++) {
      const key = parts[index];

      if (
        target[key] === null ||
        target[key] === undefined ||
        typeof target[key] !== "object"
      ) {
        target[key] = typeof parts[index + 1] === "number" ? [] : {};
      }

      target = target[key];
    }

    target[parts[parts.length - 1]] = value;
  }

  function getPathValue(object, path) {
    return parsePath(path).reduce((target, key) => {
      if (target === null || target === undefined) return undefined;
      return target[key];
    }, object);
  }

  function createPath(base, key) {
    return base ? `${base}.${key}` : String(key);
  }

  /* ---------------------------------------------------------
     4. SAFE URL HELPERS
     --------------------------------------------------------- */

  function safeHttpUrl(value, allowRelative = false) {
    if (typeof value !== "string" || !value.trim()) return null;

    const raw = value.trim();

    if (allowRelative && raw.startsWith("/") && !raw.startsWith("//")) {
      return raw;
    }

    try {
      const url = new URL(raw);

      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return null;
      }

      return url.href;
    } catch {
      return null;
    }
  }

  function isLikelyImageField(key) {
    return /image|photo|avatar|logo|picture|thumbnail|portrait/i.test(key);
  }

  function isLikelyUrlField(key) {
    return /url|link|website|linkedin|youtube|github|cv/i.test(key);
  }

  /* ---------------------------------------------------------
     5. DYNAMIC FIELD CREATION
     --------------------------------------------------------- */

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
  }

  function createPrimitiveField(key, value, path, onChange) {
    const wrapper = createElement("div", "admin-field");
    const label = createElement("label", "admin-field-label", labelize(key));

    label.htmlFor = `field-${path.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

    let input;

    if (typeof value === "boolean") {
      input = document.createElement("input");
      input.type = "checkbox";
      input.checked = value;
      input.className = "admin-checkbox";
    } else if (typeof value === "number") {
      input = document.createElement("input");
      input.type = "number";
      input.value = String(value);
      input.step = "any";
      input.className = "admin-input";
    } else if (
      typeof value === "string" &&
      (value.length > 150 || value.includes("\n"))
    ) {
      input = document.createElement("textarea");
      input.value = value;
      input.rows = Math.min(10, Math.max(3, value.split("\n").length));
      input.className = "admin-textarea";
    } else {
      input = document.createElement("input");
      input.type = "text";
      input.value = value === null || value === undefined ? "" : String(value);
      input.className = "admin-input";
    }

    input.id = label.htmlFor;
    input.name = path;
    input.autocomplete = "off";

    let imagePreview = null;
    let urlLink = null;

    if (typeof value === "string" && isLikelyImageField(key)) {
      imagePreview = createElement("img", "admin-image-preview");
      imagePreview.alt = `Aperçu : ${labelize(key)}`;
      imagePreview.hidden = true;
      imagePreview.loading = "lazy";
      wrapper.appendChild(imagePreview);
    }

    if (typeof value === "string" && isLikelyUrlField(key)) {
      urlLink = createElement("a", "admin-url-preview", "Ouvrir le lien");
      urlLink.target = "_blank";
      urlLink.rel = "noopener noreferrer";
      urlLink.hidden = true;
      wrapper.appendChild(urlLink);
    }

    function updatePreview(rawValue) {
      if (imagePreview) {
        const imageUrl = safeHttpUrl(rawValue, true);

        if (imageUrl) {
          imagePreview.src = imageUrl;
          imagePreview.hidden = false;
        } else {
          imagePreview.removeAttribute("src");
          imagePreview.hidden = true;
        }

        imagePreview.onerror = () => {
          imagePreview.hidden = true;
        };
      }

      if (urlLink) {
        const url = safeHttpUrl(rawValue, false);

        if (url) {
          urlLink.href = url;
          urlLink.hidden = false;
        } else {
          urlLink.removeAttribute("href");
          urlLink.hidden = true;
        }
      }
    }

    updatePreview(typeof value === "string" ? value : "");

    input.addEventListener("input", () => {
      let nextValue;

      if (input.type === "checkbox") {
        nextValue = input.checked;
      } else if (typeof value === "number") {
        if (input.value.trim() === "") {
          updatePreview("");
          return;
        }

        nextValue = Number(input.value);

        if (!Number.isFinite(nextValue)) return;
      } else if (value === null) {
        nextValue = input.value === "" ? null : input.value;
      } else {
        nextValue = input.value;
      }

      updatePreview(typeof nextValue === "string" ? nextValue : "");
      onChange(nextValue);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    return wrapper;
  }

  /* ---------------------------------------------------------
     6. LANGUAGE OBJECTS
     --------------------------------------------------------- */

  function renderLanguageObject(key, value, path, onChange) {
    const container = createElement("div", "admin-language-object");
    const heading = createElement("h4", "admin-subheading", labelize(key));

    container.appendChild(heading);

    const languages = ["fr", "en", "ar"];
    const keys = new Set([
      ...languages.filter(language =>
        Object.prototype.hasOwnProperty.call(value, language)
      ),
      ...Object.keys(value)
    ]);

    keys.forEach(language => {
      const fieldValue = value[language];
      const fieldPath = createPath(path, language);

      if (isPrimitive(fieldValue)) {
        const field = createPrimitiveField(
          languageLabel(language),
          fieldValue,
          fieldPath,
          nextValue => onChange(fieldPath, nextValue)
        );

        container.appendChild(field);
      } else if (isObject(fieldValue)) {
        const nested = renderObject(
          languageLabel(language),
          fieldValue,
          fieldPath,
          onChange
        );

        container.appendChild(nested);
      }
    });

    return container;
  }

  /* ---------------------------------------------------------
     7. STRING ARRAYS
     --------------------------------------------------------- */

  function renderStringArray(key, values, path, onChange) {
    const container = createElement("div", "admin-array");
    const heading = createElement("h4", "admin-subheading", labelize(key));

    container.appendChild(heading);

    const itemsContainer = createElement("div", "admin-array-items");
    container.appendChild(itemsContainer);

    function renderItems() {
      itemsContainer.replaceChildren();

      values.forEach((item, index) => {
        const row = createElement("div", "admin-array-row");
        const input = document.createElement("input");

        input.type = "text";
        input.className = "admin-input";
        input.value = item ?? "";
        input.setAttribute("aria-label", `${labelize(key)} ${index + 1}`);

        input.addEventListener("input", () => {
          values[index] = input.value;
          onChange(path, clone(values));
        });

        const removeButton = createElement("button", "admin-button admin-button-danger", "Supprimer");
        removeButton.type = "button";

        removeButton.addEventListener("click", () => {
          if (!window.confirm("Supprimer cet élément ?")) return;

          values.splice(index, 1);
          onChange(path, clone(values));
          renderItems();
        });

        row.append(input, removeButton);
        itemsContainer.appendChild(row);
      });
    }

    const addButton = createElement("button", "admin-button admin-button-secondary", "+ Ajouter un élément");
    addButton.type = "button";

    addButton.addEventListener("click", () => {
      values.push("");
      onChange(path, clone(values));
      renderItems();
    });

    renderItems();
    container.appendChild(addButton);

    return container;
  }

  /* ---------------------------------------------------------
     8. OBJECTS
     --------------------------------------------------------- */

  function renderObject(key, value, path, onChange) {
    const container = createElement("fieldset", "admin-object");
    const legend = createElement("legend", "admin-object-title", labelize(key));

    container.appendChild(legend);

    Object.keys(value).forEach(childKey => {
      const childValue = value[childKey];
      const childPath = createPath(path, childKey);

      if (isPrimitive(childValue)) {
        container.appendChild(
          createPrimitiveField(
            childKey,
            childValue,
            childPath,
            nextValue => onChange(childPath, nextValue)
          )
        );
      } else if (Array.isArray(childValue)) {
        const child = childValue.every(item => isPrimitive(item))
          ? renderStringArray(childKey, childValue, childPath, onChange)
          : renderComplexArray(childKey, childValue, childPath, onChange);

        container.appendChild(child);
      } else if (isObject(childValue)) {
        if (
          ["fr", "en", "ar"].some(language =>
            Object.prototype.hasOwnProperty.call(childValue, language)
          )
        ) {
          container.appendChild(
            renderLanguageObject(childKey, childValue, childPath, onChange)
          );
        } else {
          container.appendChild(
            renderObject(childKey, childValue, childPath, onChange)
          );
        }
      } else {
        container.appendChild(
          createPrimitiveField(
            childKey,
            "",
            childPath,
            nextValue => onChange(childPath, nextValue)
          )
        );
      }
    });

    return container;
  }

  /* ---------------------------------------------------------
     9. COMPLEX ARRAYS
     --------------------------------------------------------- */

  function renderComplexArray(key, values, path, onChange) {
    const container = createElement("div", "admin-complex-array");
    const heading = createElement("h4", "admin-subheading", labelize(key));

    container.appendChild(heading);

    const itemsContainer = createElement("div", "admin-complex-array-items");
    container.appendChild(itemsContainer);

    function renderItems() {
      itemsContainer.replaceChildren();

      values.forEach((item, index) => {
        const itemWrapper = createElement("div", "admin-array-item");
        const itemHeader = createElement("div", "admin-array-item-header");

        const itemTitle = createElement(
          "strong",
          "admin-array-item-title",
          `${labelize(key)} ${index + 1}`
        );

        const controls = createElement("div", "admin-array-item-controls");

        const upButton = createElement("button", "admin-button admin-button-small", "↑");
        upButton.type = "button";
        upButton.disabled = index === 0;
        upButton.title = "Déplacer vers le haut";

        upButton.addEventListener("click", () => {
          if (index === 0) return;

          [values[index - 1], values[index]] =
            [values[index], values[index - 1]];

          onChange(path, clone(values));
          renderItems();
        });

        const downButton = createElement("button", "admin-button admin-button-small", "↓");
        downButton.type = "button";
        downButton.disabled = index === values.length - 1;
        downButton.title = "Déplacer vers le bas";

        downButton.addEventListener("click", () => {
          if (index >= values.length - 1) return;

          [values[index], values[index + 1]] =
            [values[index + 1], values[index]];

          onChange(path, clone(values));
          renderItems();
        });

        const removeButton = createElement("button", "admin-button admin-button-danger", "Supprimer");
        removeButton.type = "button";

        removeButton.addEventListener("click", () => {
          if (!window.confirm("Supprimer cet élément ?")) return;

          values.splice(index, 1);
          onChange(path, clone(values));
          renderItems();
        });

        controls.append(upButton, downButton, removeButton);
        itemHeader.append(itemTitle, controls);
        itemWrapper.appendChild(itemHeader);

        if (isObject(item)) {
          itemWrapper.appendChild(
            renderObject(
              `${labelize(key)} ${index + 1}`,
              item,
              createPath(path, index),
              onChange
            )
          );
        } else if (Array.isArray(item)) {
          itemWrapper.appendChild(
            renderComplexArray(
              `${labelize(key)} ${index + 1}`,
              item,
              createPath(path, index),
              onChange
            )
          );
        } else {
          itemWrapper.appendChild(
            createPrimitiveField(
              "Valeur",
              item,
              createPath(path, index),
              nextValue => onChange(createPath(path, index), nextValue)
            )
          );
        }

        itemsContainer.appendChild(itemWrapper);
      });
    }

    const addButton = createElement("button", "admin-button admin-button-secondary", "+ Ajouter");
    addButton.type = "button";

    addButton.addEventListener("click", () => {
      const firstItem = values.find(item => isObject(item));

      if (firstItem) {
        const newItem = {};

        Object.keys(firstItem).forEach(itemKey => {
          const originalValue = firstItem[itemKey];

          if (typeof originalValue === "string") {
            newItem[itemKey] = "";
          } else if (typeof originalValue === "number") {
            newItem[itemKey] = 0;
          } else if (typeof originalValue === "boolean") {
            newItem[itemKey] = false;
          } else if (Array.isArray(originalValue)) {
            newItem[itemKey] = [];
          } else if (isObject(originalValue)) {
            newItem[itemKey] = clone(originalValue);
          } else {
            newItem[itemKey] = null;
          }
        });

        values.push(newItem);
      } else if (values.every(item => isPrimitive(item))) {
        values.push("");
      } else {
        values.push({});
      }

      onChange(path, clone(values));
      renderItems();
    });

    renderItems();
    container.appendChild(addButton);

    return container;
  }

  /* ---------------------------------------------------------
     10. CLEAR OBJECT VALUES
     --------------------------------------------------------- */

  function clearObjectValues(object) {
    if (Array.isArray(object)) return [];

    if (!isObject(object)) return "";

    const result = {};

    Object.keys(object).forEach(key => {
      const value = object[key];

      if (typeof value === "string") {
        result[key] = "";
      } else if (typeof value === "number") {
        result[key] = 0;
      } else if (typeof value === "boolean") {
        result[key] = false;
      } else if (Array.isArray(value)) {
        result[key] = [];
      } else if (isObject(value)) {
        result[key] = clearObjectValues(value);
      } else {
        result[key] = null;
      }
    });

    return result;
  }

  /* ---------------------------------------------------------
     11. SECTION EDITOR
     --------------------------------------------------------- */

  function renderSection(section) {
    const editor = document.getElementById("sectionEditor");
    if (!editor) return;

    editor.replaceChildren();

    const data = currentData[section];

    const heading = createElement(
      "h2",
      "admin-section-title",
      SECTION_LABELS[section] || labelize(section)
    );

    const description = createElement(
      "p",
      "admin-section-description",
      "Modifie les champs ci-dessous, puis clique sur « Enregistrer »."
    );

    const status = createElement("div", "admin-status");
    status.id = "editorStatus";
    status.hidden = true;

    const fields = createElement("div", "admin-section-fields");

    function handleChange(path, value) {
      setPathValue(currentData[section], path, value);
      updateSaveButton();
      renderNavigation();
      clearStatus(status);
    }

    if (isPrimitive(data)) {
      fields.appendChild(
        createPrimitiveField(
          section,
          data,
          section,
          nextValue => {
            currentData[section] = nextValue;
            updateSaveButton();
            renderNavigation();
            clearStatus(status);
          }
        )
      );
    } else if (Array.isArray(data)) {
      if (data.every(item => isPrimitive(item))) {
        fields.appendChild(
          renderStringArray(section, data, section, handleChange)
        );
      } else {
        fields.appendChild(
          renderComplexArray(section, data, section, handleChange)
        );
      }
    } else if (isObject(data)) {
      Object.keys(data).forEach(key => {
        const value = data[key];
        const path = createPath("", key);

        if (isPrimitive(value)) {
          fields.appendChild(
            createPrimitiveField(
              key,
              value,
              path,
              nextValue => handleChange(path, nextValue)
            )
          );
        } else if (Array.isArray(value)) {
          fields.appendChild(
            value.every(item => isPrimitive(item))
              ? renderStringArray(key, value, path, handleChange)
              : renderComplexArray(key, value, path, handleChange)
          );
        } else if (isObject(value)) {
          if (
            ["fr", "en", "ar"].some(language =>
              Object.prototype.hasOwnProperty.call(value, language)
            )
          ) {
            fields.appendChild(
              renderLanguageObject(key, value, path, handleChange)
            );
          } else {
            fields.appendChild(
              renderObject(key, value, path, handleChange)
            );
          }
        }
      });
    } else {
      fields.appendChild(
        createElement(
          "p",
          "admin-empty",
          "Aucun contenu modifiable dans cette section."
        )
      );
    }

    const actions = createElement("div", "admin-editor-actions");

    const saveButton = createElement("button", "admin-button admin-button-primary", "Enregistrer");
    saveButton.type = "button";
    saveButton.id = "saveSectionBtn";
    saveButton.addEventListener("click", () => saveSection(section));

    const resetButton = createElement("button", "admin-button admin-button-secondary", "Réinitialiser");
    resetButton.type = "button";
    resetButton.addEventListener("click", () => {
      if (!isDirty(section)) return;

      const confirmed = window.confirm(
        "Annuler toutes les modifications non enregistrées de cette section ?"
      );

      if (!confirmed) return;

      currentData[section] = clone(JSON.parse(savedSnapshots[section]));
      renderSection(section);
      renderNavigation();
    });

    actions.append(saveButton, resetButton);
    editor.append(heading, description, status, fields, actions);

    updateSaveButton();
  }

  function updateSaveButton() {
    const button = document.getElementById("saveSectionBtn");

    if (!button || !currentSection) return;

    const dirty = isDirty(currentSection);
    const saving = savingSections.has(currentSection);

    button.disabled = saving || !dirty;
    button.textContent = saving
      ? "Enregistrement..."
      : dirty
        ? "Enregistrer les modifications"
        : "Aucune modification";
  }

  function renderCurrentSection() {
    if (currentSection && currentData[currentSection] !== undefined) {
      renderSection(currentSection);
    }
  }

  /* ---------------------------------------------------------
     12. SECTION NAVIGATION
     --------------------------------------------------------- */

  function renderNavigation() {
    const nav = document.getElementById("sectionNav");
    if (!nav) return;

    nav.replaceChildren();

    Object.keys(currentData).forEach(section => {
      const button = createElement("button", "admin-nav-button");

      const dirty = isDirty(section);
      const label = SECTION_LABELS[section] || labelize(section);

      button.textContent = dirty ? `${label} •` : label;
      button.type = "button";
      button.dataset.section = section;
      button.classList.toggle("active", section === currentSection);
      button.classList.toggle("dirty", dirty);
      button.setAttribute("aria-current", section === currentSection ? "page" : "false");

      button.addEventListener("click", () => {
        if (section === currentSection) return;
        if (!confirmDiscard(currentSection)) return;

        currentSection = section;
        renderNavigation();
        renderCurrentSection();
      });

      nav.appendChild(button);
    });
  }

  /* ---------------------------------------------------------
     13. LOAD CONTENT FROM SUPABASE
     --------------------------------------------------------- */

  async function loadSections() {
    if (!supabase) {
      throw new Error(
        "Le client Supabase est introuvable. Vérifie le chargement de supabaseClient."
      );
    }

    isLoading = true;

    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("section, content");

      if (error) throw error;

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(
          "Aucun contenu trouvé dans site_content. Vérifie les données de la base."
        );
      }

      const nextData = {};
      const nextSnapshots = {};

      data.forEach(row => {
        if (typeof row.section !== "string") return;

        nextData[row.section] = clone(row.content);
        nextSnapshots[row.section] = JSON.stringify(row.content);
      });

      currentData = nextData;
      savedSnapshots = nextSnapshots;

      const preferredSection = Object.keys(SECTION_LABELS).find(
        section => Object.prototype.hasOwnProperty.call(currentData, section)
      );

      currentSection = preferredSection || Object.keys(currentData)[0] || null;

      if (!currentSection) {
        throw new Error("Aucune section valide n’a été chargée.");
      }

      renderNavigation();
      renderCurrentSection();
    } finally {
      isLoading = false;
    }
  }

  /* ---------------------------------------------------------
     14. SAVE A SECTION
     --------------------------------------------------------- */

  async function saveSection(section) {
    if (!supabase) {
      showStatus("Connexion à Supabase indisponible.", "error");
      return;
    }

    if (savingSections.has(section)) return;

    const saveButton = document.getElementById("saveSectionBtn");

    if (!isDirty(section)) {
      showStatus("Aucune modification à enregistrer.", "info");
      return;
    }

    savingSections.add(section);

    if (saveButton && currentSection === section) {
      saveButton.disabled = true;
      saveButton.textContent = "Enregistrement...";
    }

    const submittedSnapshot = clone(currentData[section]);
    const submittedJson = JSON.stringify(submittedSnapshot);

    try {
      const { error } = await supabase
        .from("site_content")
        .update({ content: submittedSnapshot })
        .eq("section", section);

      if (error) throw error;

      savedSnapshots[section] = submittedJson;

      if (currentSection === section) {
        showStatus("Modifications enregistrées avec succès.", "success");
      }

      renderNavigation();

      if (currentSection === section) {
        updateSaveButton();
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);

      showStatus(
        `Échec de l’enregistrement : ${error.message || "erreur inconnue"}`,
        "error"
      );
    } finally {
      savingSections.delete(section);

      if (currentSection === section) {
        updateSaveButton();
      }
    }
  }

  /* ---------------------------------------------------------
     15. AUTHENTICATION CHECK
     --------------------------------------------------------- */

  async function checkAdmin(user) {
    if (!supabase || !user) return false;

    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erreur de vérification administrateur :", error);
        return false;
      }

      return Boolean(data && data.user_id === user.id);
    } catch (error) {
      console.error("Vérification administrateur impossible :", error);
      return false;
    }
  }

  /* ---------------------------------------------------------
     16. LOGIN / LOGOUT UI
     --------------------------------------------------------- */

  function showLogin() {
    const loginSection = document.getElementById("loginSection");
    const adminSection = document.getElementById("adminSection");

    if (loginSection) loginSection.hidden = false;
    if (adminSection) adminSection.hidden = true;

    currentUser = null;
    adminInitialized = false;
  }

  function buildAdminLayout() {
    const adminSection = document.getElementById("adminSection");
    if (!adminSection) return;

    let layout = document.getElementById("cmsLayout");

    if (!layout) {
      layout = createElement("div", "admin-layout");
      layout.id = "cmsLayout";

      const sidebar = createElement("aside", "admin-sidebar");
      const sidebarTitle = createElement("h2", "admin-sidebar-title", "Contenus du site");

      const nav = createElement("nav", "admin-navigation");
      nav.id = "sectionNav";
      nav.setAttribute("aria-label", "Sections du contenu");

      sidebar.append(sidebarTitle, nav);

      const main = createElement("main", "admin-main");
      const editor = createElement("div", "admin-editor");
      editor.id = "sectionEditor";

      main.appendChild(editor);
      layout.append(sidebar, main);
      adminSection.appendChild(layout);
    }
  }

  async function showAdmin(user) {
    const loginSection = document.getElementById("loginSection");
    const adminSection = document.getElementById("adminSection");

    if (loginSection) loginSection.hidden = true;
    if (adminSection) adminSection.hidden = false;

    currentUser = user;

    buildAdminLayout();

    if (!adminInitialized) {
      try {
        const editor = document.getElementById("sectionEditor");

        if (editor) {
          editor.replaceChildren(
            createElement("p", "admin-loading", "Chargement des contenus...")
          );
        }

        await loadSections();
        adminInitialized = true;
      } catch (error) {
        console.error("Erreur de chargement des contenus :", error);

        showStatus(
          `Impossible de charger les contenus : ${error.message || "erreur inconnue"}`,
          "error",
          document.getElementById("sectionEditor")
        );
      }
    }
  }

  async function login(event) {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const status = document.getElementById("loginStatus");

    if (!supabase) {
      showStatus("Le client Supabase n’est pas initialisé.", "error", status);
      return;
    }

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!email || !password) {
      showStatus("Veuillez saisir votre e-mail et votre mot de passe.", "error", status);
      return;
    }

    const submitButton = document.querySelector(
      '#loginForm button[type="submit"], #loginForm input[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText =
        submitButton.tagName === "INPUT"
          ? submitButton.value
          : submitButton.textContent;

      if (submitButton.tagName === "INPUT") {
        submitButton.value = "Connexion...";
      } else {
        submitButton.textContent = "Connexion...";
      }
    }

    clearStatus(status);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      const user = data.user;

      if (!user) {
        throw new Error("Aucun utilisateur n’a été retourné.");
      }

      const isAdmin = await checkAdmin(user);

      if (!isAdmin) {
        await supabase.auth.signOut();

        throw new Error(
          "Ce compte n’est pas autorisé à accéder à l’administration."
        );
      }

      currentUser = user;
      adminInitialized = false;

      await showAdmin(user);
    } catch (error) {
      console.error("Erreur de connexion :", error);

      showStatus(
        error.message || "Connexion impossible. Vérifiez vos identifiants.",
        "error",
        status
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;

        if (submitButton.tagName === "INPUT") {
          submitButton.value = submitButton.dataset.originalText || "Connexion";
        } else {
          submitButton.textContent = submitButton.dataset.originalText || "Connexion";
        }
      }
    }
  }

  async function logout() {
    if (!confirmLeaveAdmin()) return;

    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }

      currentData = {};
      savedSnapshots = {};
      currentSection = null;
      currentUser = null;
      adminInitialized = false;

      showLogin();
    } catch (error) {
      console.error("Erreur de déconnexion :", error);

      showStatus(
        `Impossible de se déconnecter : ${error.message || "erreur inconnue"}`
      );
    }
  }

  /* ---------------------------------------------------------
     17. INITIALIZATION
     --------------------------------------------------------- */

  async function initializeAdmin() {
    const loginForm = document.getElementById("loginForm");
    const logoutButton = document.getElementById("logoutBtn");

    if (loginForm) {
      loginForm.addEventListener("submit", login);
    }

    if (logoutButton) {
      logoutButton.addEventListener("click", logout);
    }

    if (!supabase) {
      showLogin();

      showStatus(
        "Supabase n’est pas initialisé. Vérifie que le script client Supabase est chargé avant admin.js.",
        "error",
        document.getElementById("loginStatus")
      );

      return;
    }

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      const user = data.session?.user;

      if (!user) {
        showLogin();
        return;
      }

      const isAdmin = await checkAdmin(user);

      if (!isAdmin) {
        await supabase.auth.signOut();
        showLogin();

        showStatus(
          "Ce compte n’est pas autorisé à accéder à l’administration.",
          "error",
          document.getElementById("loginStatus")
        );

        return;
      }

      await showAdmin(user);
    } catch (error) {
      console.error("Erreur d'initialisation :", error);

      showLogin();

      showStatus(
        `Erreur d’initialisation : ${error.message || "erreur inconnue"}`,
        "error",
        document.getElementById("loginStatus")
      );
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        currentUser = null;
        adminInitialized = false;
        showLogin();
      }

      if (event === "SIGNED_IN" && session?.user) {
        currentUser = session.user;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAdmin);
  } else {
    initializeAdmin();
  }
})();
