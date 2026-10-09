/* =========================================================
   ADMIN CMS — ABDELAZIZ TALHAOUI
   Version sécurisée — Supabase + interface structurée
   Protection des modifications non enregistrées
   Sauvegarde contrôlée — Données existantes préservées
========================================================= */

const SECTION_LABELS = {
  settings: "⚙️ Paramètres",
  profile: "👤 Profil",
  loop: "🔄 Approche professionnelle",
  categories: "🏷️ Catégories",
  expertises: "🎯 Expertises",
  experiences: "💼 Expériences professionnelles",
  projects: "🚀 Projets majeurs",
  achievements: "🏆 Réalisations clés",
  research: "🔬 Recherche & formation",
  productions: "📚 Productions",
  tools: "🛠️ Outils",
  formalab: "🎥 FORMA LAB",
  links: "🔗 Liens"
};

const FIELD_LABELS = {
  name: "Nom",
  title: "Titre",
  tagline: "Accroche",
  sub: "Présentation courte",
  about: "Présentation / À propos",
  vision: "Vision",
  method: "Méthode",
  role: "Rôle",
  dates: "Période",
  context: "Contexte",
  resp: "Responsabilités",
  projects: "Projets",
  achievements: "Réalisations",
  impact: "Impact",
  description: "Description",
  education: "Formation",
  status: "Statut",
  thesis: "Mémoire / Thèse",
  question: "Question de recherche",
  certifications: "Certifications",
  publications: "Publications",
  talks: "Interventions",
  modules: "Modules",
  participantPack: "Pack participant",
  trainerPack: "Pack formateur",
  evaluation: "Évaluation",
  frameworks: "Référentiels",
  production: "Production",
  digital: "Outils numériques",
  ai: "Intelligence artificielle",
  analysis: "Analyse",
  collaboration: "Collaboration",
  sig: "Signature",
  desc: "Description",
  youtube: "Chaîne YouTube",
  items: "Contenus",
  linkedin: "LinkedIn",
  email: "E-mail",
  formAction: "Action du formulaire",
  cv: "CV",
  draft: "Brouillon",
  lang: "Langue"
};

/* =========================================================
   ÉTAT DU CMS
========================================================= */

let currentData = {};
let currentSection = null;
let currentUser = null;

// Copie de référence du contenu chargé ou enregistré.
const savedSnapshots = new Map();

// Empêche plusieurs sauvegardes simultanées de la même section.
const savingSections = new Set();

// Évite les doubles initialisations.
let adminInitialized = false;

/* =========================================================
   PROTECTION DES MODIFICATIONS NON ENREGISTRÉES
========================================================= */

function snapshot(value) {
  return JSON.stringify(value);
}

function isDirty(section = currentSection) {
  if (!section || !(section in currentData)) {
    return false;
  }

  return (
    savedSnapshots.get(section) !==
    snapshot(currentData[section])
  );
}

function hasUnsavedChanges() {
  return Object.keys(currentData).some(section =>
    isDirty(section)
  );
}

function confirmDiscard(section = currentSection) {
  if (!isDirty(section)) {
    return true;
  }

  return window.confirm(
    "Cette section contient des modifications non enregistrées.\n\n" +
    "Veux-tu vraiment continuer sans les enregistrer ?"
  );
}

function confirmLeaveAdmin() {
  if (!hasUnsavedChanges()) {
    return true;
  }

  return window.confirm(
    "Certaines sections contiennent des modifications non enregistrées.\n\n" +
    "Si tu te déconnectes, ces modifications en mémoire seront perdues.\n\n" +
    "Veux-tu vraiment te déconnecter ?"
  );
}

// Avertissement du navigateur avant de quitter ou d'actualiser.
window.addEventListener("beforeunload", event => {
  if (hasUnsavedChanges()) {
    event.preventDefault();
    event.returnValue = "";
  }
});

/* =========================================================
   UTILITAIRES
========================================================= */

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function isPrimitive(value) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  );
}

function labelize(key) {
  if (FIELD_LABELS[key]) {
    return FIELD_LABELS[key];
  }

  return String(key)
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/^./, character => character.toUpperCase());
}

function languageLabel(key) {
  if (key === "fr") return "🇫🇷 Français";
  if (key === "en") return "🇬🇧 English";

  return null;
}

function showStatus(message, type = "success") {
  let box = document.getElementById("globalStatus");

  if (!box) {
    box = document.createElement("div");
    box.id = "globalStatus";

    Object.assign(box.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: "9999",
      padding: "14px 20px",
      borderRadius: "10px",
      fontWeight: "600",
      boxShadow: "0 10px 30px rgba(0,0,0,.12)",
      maxWidth: "400px",
      fontSize: "14px"
    });

    document.body.appendChild(box);
  }

  box.textContent = message;

  box.style.background =
    type === "error" ? "#fee2e2" : "#dcfce7";

  box.style.color =
    type === "error" ? "#991b1b" : "#166534";

  clearTimeout(box._timer);

  box._timer = setTimeout(() => {
    box.remove();
  }, 4500);
}

/* =========================================================
   GESTION DES CHEMINS
========================================================= */

function parsePath(path) {
  return path.split(".").map(part =>
    /^\d+$/.test(part) ? Number(part) : part
  );
}

function setPathValue(obj, path, value) {
  const parts = parsePath(path);
  let target = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    if (target == null) {
      throw new Error("Chemin de données invalide : " + path);
    }

    target = target[parts[i]];
  }

  if (target == null) {
    throw new Error("Champ introuvable : " + path);
  }

  target[parts[parts.length - 1]] = value;
}

/* =========================================================
   CHAMP PRIMITIF
========================================================= */


function createPrimitiveField(value, path, options = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "cms-field";

  const key = path.split(".").pop();
  const normalizedKey = key.toLowerCase();

  const label = document.createElement("label");
  label.textContent = options.label || labelize(key);
  Object.assign(label.style, {
    display: "block",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "7px"
  });

  const isImageField =
    /(image|photo|avatar|thumbnail|logo|picture|portrait)/i
      .test(normalizedKey);

  const isUrlField =
    /(url|link|linkedin|youtube|website|site|href|src|cv)/i
      .test(normalizedKey) ||
    (typeof value === "string" &&
      /^https?:\/\//i.test(value.trim()));

  const isEmailField =
    normalizedKey === "email" ||
    normalizedKey.includes("email");

  const isLong =
    options.long ||
    String(value ?? "").length > 180;

  let input;

  if (typeof value === "boolean") {
    input = document.createElement("select");

    [
      { value: "true", text: "Oui" },
      { value: "false", text: "Non" }
    ].forEach(item => {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.text;
      input.appendChild(option);
    });

    input.value = String(value);

  } else if (typeof value === "number") {
    input = document.createElement("input");
    input.type = "number";
    input.step = "any";
    input.value = String(value);

  } else if (isEmailField) {
    input = document.createElement("input");
    input.type = "email";
    input.value = value ?? "";

  } else if (isUrlField) {
    input = document.createElement("input");
    input.type = "url";
    input.value = value ?? "";
    input.placeholder = "https://...";

  } else if (isLong) {
    input = document.createElement("textarea");
    input.rows = 5;
    input.value = value ?? "";

  } else {
    input = document.createElement("input");
    input.type = "text";
    input.value = value ?? "";
  }

  input.dataset.path = path;

  Object.assign(input.style, {
    display: "block",
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    font: "inherit",
    marginTop: "7px",
    marginBottom: "10px",
    boxSizing: "border-box",
    background: "#fff"
  });

  let preview = null;
  let openLink = null;

  if (isImageField) {
    preview = document.createElement("img");
    preview.alt = "Aperçu de " + label.textContent;
    preview.loading = "lazy";

    Object.assign(preview.style, {
      display: "none",
      maxWidth: "220px",
      maxHeight: "160px",
      objectFit: "contain",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "5px",
      marginBottom: "12px",
      background: "#fff"
    });

    preview.onerror = () => {
      preview.style.display = "none";
    };
  }

  if (isUrlField && !isImageField) {
    openLink = document.createElement("a");
    openLink.textContent = "↗ Ouvrir le lien";
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";

    Object.assign(openLink.style, {
      display: "inline-block",
      marginBottom: "12px",
      color: "#2563eb",
      fontWeight: "600",
      textDecoration: "none"
    });
  }

  function validHttpUrl(rawValue) {
    try {
      const url = new URL(
        String(rawValue || "").trim(),
        window.location.href
      );

      if (!["http:", "https:"].includes(url.protocol)) {
        return null;
      }

      return url.href;
    } catch {
      return null;
    }
  }

  function updatePreview() {
    const rawValue = input.value.trim();
    const safeUrl = validHttpUrl(rawValue);

    if (preview) {
      if (safeUrl) {
        preview.src = safeUrl;
        preview.style.display = "block";
      } else {
        preview.removeAttribute("src");
        preview.style.display = "none";
      }
    }

    if (openLink) {
      if (safeUrl) {
        openLink.href = safeUrl;
        openLink.style.display = "inline-block";
      } else {
        openLink.removeAttribute("href");
        openLink.style.display = "none";
      }
    }
  }

  function updateValue() {
    let nextValue = input.value;

    if (typeof value === "boolean") {
      nextValue = input.value === "true";

    } else if (typeof value === "number") {
      if (input.value.trim() === "") {
        showStatus(
          "Ce champ doit contenir un nombre.",
          "error"
        );
        return;
      }

      nextValue = Number(input.value);

      if (!Number.isFinite(nextValue)) {
        showStatus("Valeur numérique invalide.", "error");
        return;
      }
    }

    try {
      setPathValue(currentData, path, nextValue);
    } catch (error) {
      console.error(error);
      showStatus(
        "Impossible de modifier ce champ.",
        "error"
      );
    }

    updatePreview();
  }

  input.addEventListener("input", updateValue);
  input.addEventListener("change", updateValue);

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  if (preview) {
    wrapper.appendChild(preview);
  }

  if (openLink) {
    wrapper.appendChild(openLink);
  }

  updatePreview();

  return wrapper;
}

/* =========================================================
   OBJET MULTILINGUE FR / EN
========================================================= */

function renderLanguageObject(obj, path, title) {
  const container = document.createElement("div");
  container.className = "cms-language-group";

  Object.assign(container.style, {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "18px",
    marginBottom: "18px",
    background: "#fafafa"
  });

  if (title) {
    const heading = document.createElement("h3");
    heading.textContent = title;

    Object.assign(heading.style, {
      margin: "0 0 18px",
      fontSize: "17px",
      color: "#111827"
    });

    container.appendChild(heading);
  }

  ["fr", "en"].forEach(lang => {
    if (!Object.prototype.hasOwnProperty.call(obj, lang)) {
      return;
    }

    const languageBox = document.createElement("div");

    Object.assign(languageBox.style, {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "9px",
      padding: "14px",
      marginBottom: "12px"
    });

    const languageTitle = document.createElement("div");
    languageTitle.textContent = languageLabel(lang);

    Object.assign(languageTitle.style, {
      fontWeight: "700",
      marginBottom: "8px",
      color: "#111827"
    });

    languageBox.appendChild(languageTitle);

    const value = obj[lang];

    const field = createPrimitiveField(
      value,
      `${path}.${lang}`,
      {
        label: lang === "fr" ? "Français" : "English",
        long: String(value ?? "").length > 120
      }
    );

    languageBox.appendChild(field);
    container.appendChild(languageBox);
  });

  return container;
}

/* =========================================================
   TABLEAU DE CHAÎNES
========================================================= */

function renderStringArray(array, path, title) {
  const container = document.createElement("div");
  container.className = "cms-array";

  const header = document.createElement("div");

  Object.assign(header.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  });

  const heading = document.createElement("h3");
  heading.textContent = `${title} (${array.length})`;
  heading.style.margin = "0";

  const add = document.createElement("button");
  add.type = "button";
  add.textContent = "+ Ajouter";
  add.className = "secondary";

  add.onclick = () => {
    array.push("");
    renderCurrentSection();
  };

  header.append(heading, add);
  container.appendChild(header);

  array.forEach((item, index) => {
    const row = document.createElement("div");

    Object.assign(row.style, {
      display: "flex",
      gap: "8px",
      marginBottom: "10px",
      alignItems: "flex-start"
    });

    const input = document.createElement("textarea");
    input.rows = 2;
    input.value = item ?? "";

    Object.assign(input.style, {
      flex: "1",
      padding: "10px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      font: "inherit",
      resize: "vertical"
    });

    input.oninput = () => {
      array[index] = input.value;
    };

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.className = "danger";
    remove.title = "Supprimer";

    remove.onclick = () => {
      if (
        !window.confirm(
          "Supprimer cet élément de la liste ?"
        )
      ) {
        return;
      }

      array.splice(index, 1);
      renderCurrentSection();
    };

    row.append(input, remove);
    container.appendChild(row);
  });

  return container;
}

/* =========================================================
   OBJET
========================================================= */

function renderObject(obj, path, title = "") {
  const container = document.createElement("div");
  container.className = "cms-object";

  if (title) {
    const heading = document.createElement("h3");
    heading.textContent = title;

    Object.assign(heading.style, {
      marginTop: "0",
      marginBottom: "18px",
      fontSize: "18px",
      color: "#111827"
    });

    container.appendChild(heading);
  }

  Object.keys(obj).forEach(key => {
    const value = obj[key];

    const childPath = path
      ? `${path}.${key}`
      : key;

    // Objet bilingue FR / EN
    if (
      isObject(value) &&
      (
        Object.prototype.hasOwnProperty.call(value, "fr") ||
        Object.prototype.hasOwnProperty.call(value, "en")
      ) &&
      Object.keys(value).every(k => k === "fr" || k === "en")
    ) {
      container.appendChild(
        renderLanguageObject(value, childPath, labelize(key))
      );

      return;
    }

    // Valeur simple
    if (isPrimitive(value)) {
      container.appendChild(
        createPrimitiveField(value, childPath)
      );

      return;
    }

    // Tableau
    if (Array.isArray(value)) {
      if (value.every(item => isPrimitive(item))) {
        container.appendChild(
          renderStringArray(value, childPath, labelize(key))
        );
      } else {
        container.appendChild(
          renderComplexArray(value, childPath, labelize(key))
        );
      }

      return;
    }

    // Objet imbriqué
    if (isObject(value)) {
      const group = document.createElement("div");

      Object.assign(group.style, {
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "18px",
        marginBottom: "18px",
        background: "#fafafa"
      });

      group.appendChild(
        renderObject(value, childPath, labelize(key))
      );

      container.appendChild(group);
    }
  });

  return container;
}

/* =========================================================
   TABLEAU COMPLEXE
========================================================= */

function renderComplexArray(array, path, title) {
  const container = document.createElement("div");

  Object.assign(container.style, {
    marginBottom: "25px"
  });

  const header = document.createElement("div");

  Object.assign(header.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  });

  const titleElement = document.createElement("h3");
  titleElement.textContent = `${title} (${array.length})`;
  titleElement.style.margin = "0";

  const add = document.createElement("button");
  add.type = "button";
  add.className = "secondary";
  add.textContent = "+ Ajouter";

  add.onclick = () => {
    let template = {};

    if (array.length > 0) {
      template = clone(array[0]);

      if (isObject(template)) {
        clearObjectValues(template);
      } else if (Array.isArray(template)) {
        template = [];
      } else if (typeof template === "boolean") {
        template = false;
      } else {
        template = "";
      }
    }

    array.push(template);
    renderCurrentSection();
  };

  header.append(titleElement, add);
  container.appendChild(header);

  array.forEach((item, index) => {
    const card = document.createElement("div");

    Object.assign(card.style, {
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "15px",
      background: "#fff"
    });

    const cardHeader = document.createElement("div");

    Object.assign(cardHeader.style, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px"
    });

    const number = document.createElement("strong");
    number.textContent = `${title} — ${index + 1}`;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger";
    remove.textContent = "Supprimer";

    remove.onclick = () => {
      if (
        !window.confirm(
          "Supprimer cet élément de l'éditeur ?"
        )
      ) {
        return;
      }

      array.splice(index, 1);
      renderCurrentSection();
    };

    cardHeader.append(number, remove);
    card.appendChild(cardHeader);

    if (isObject(item)) {
      card.appendChild(
        renderObject(item, `${path}.${index}`)
      );
    } else if (Array.isArray(item)) {
      card.appendChild(
        renderComplexArray(item, `${path}.${index}`, `${title} — ${index + 1}`)
      );
    } else {
      card.appendChild(
        createPrimitiveField(item, `${path}.${index}`)
      );
    }

    container.appendChild(card);
  });

  return container;
}

/* =========================================================
   NETTOYAGE D'UN NOUVEL ÉLÉMENT
========================================================= */

function clearObjectValues(obj) {
  Object.keys(obj).forEach(key => {
    if (Array.isArray(obj[key])) {
      obj[key] = [];
    } else if (isObject(obj[key])) {
      clearObjectValues(obj[key]);
    } else if (typeof obj[key] === "boolean") {
      obj[key] = false;
    } else if (typeof obj[key] === "number") {
      obj[key] = 0;
    } else {
      obj[key] = "";
    }
  });

  return obj;
}

/* =========================================================
   AFFICHAGE D'UNE SECTION
========================================================= */

function renderSection(section) {
  const container = document.getElementById("sectionEditor");

  if (!container) return;

  container.innerHTML = "";

  const data = currentData[section];

  if (data === undefined) {
    container.textContent = "Cette section est introuvable.";
    return;
  }

  const title = document.createElement("h2");
  title.textContent = SECTION_LABELS[section] || labelize(section);

  Object.assign(title.style, {
    marginTop: "0",
    marginBottom: "8px"
  });

  container.appendChild(title);

  const description = document.createElement("p");
  description.textContent =
    "Modifie les informations puis clique sur « Enregistrer ».";

  Object.assign(description.style, {
    color: "#6b7280",
    marginBottom: "25px"
  });

  container.appendChild(description);

  const editor = document.createElement("div");

  if (Array.isArray(data)) {
    editor.appendChild(
      renderComplexArray(
        data,
        section,
        SECTION_LABELS[section] || section
      )
    );
  } else if (isObject(data)) {
    editor.appendChild(renderObject(data, section));
  } else {
    editor.appendChild(createPrimitiveField(data, section));
  }

  container.appendChild(editor);

  const actions = document.createElement("div");

  Object.assign(actions.style, {
    display: "flex",
    gap: "10px",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb"
  });

  const save = document.createElement("button");
  save.type = "button";
  save.className = "primary";
  save.textContent = "💾 Enregistrer";

  save.onclick = () => saveSection(section);

  actions.appendChild(save);
  container.appendChild(actions);
}

function renderCurrentSection() {
  if (currentSection) {
    renderSection(currentSection);
  }
}

/* =========================================================
   NAVIGATION — PROTECTION DES MODIFICATIONS
========================================================= */

function renderNavigation() {
  const nav = document.getElementById("sectionNav");

  if (!nav) return;

  nav.innerHTML = "";

  Object.keys(SECTION_LABELS).forEach(section => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = SECTION_LABELS[section];

    Object.assign(button.style, {
      width: "100%",
      textAlign: "left",
      padding: "12px 14px",
      border: "0",
      borderRadius: "8px",
      background:
        section === currentSection ? "#111827" : "transparent",
      color:
        section === currentSection ? "#fff" : "#374151",
      cursor: "pointer",
      marginBottom: "4px",
      fontWeight:
        section === currentSection ? "600" : "400"
    });

    button.onclick = () => {
      if (section === currentSection) return;

      if (!confirmDiscard(currentSection)) {
        return;
      }

      currentSection = section;

      renderNavigation();
      renderSection(section);
    };

    nav.appendChild(button);
  });
}

/* =========================================================
   CHARGEMENT SUPABASE — SANS MODIFIER LES DONNÉES
========================================================= */

async function loadSections() {
  showStatus("Chargement du contenu...");

  try {
    const { data, error } = await window.supabaseClient
      .from("site_content")
      .select("section, content");

    if (error) throw error;

    if (!Array.isArray(data)) {
      throw new Error("Réponse Supabase invalide.");
    }

    // On remplace uniquement l'état local du navigateur.
    // Aucune écriture dans Supabase n'est effectuée ici.
    currentData = {};
    savedSnapshots.clear();

    data.forEach(row => {
      currentData[row.section] = clone(row.content);

      savedSnapshots.set(
        row.section,
        snapshot(row.content)
      );
    });

    if (!currentSection || !(currentSection in currentData)) {
      currentSection =
        "profile" in currentData
          ? "profile"
          : Object.keys(currentData)[0] || null;
    }

    renderNavigation();

    if (currentSection) {
      renderSection(currentSection);
    }

    showStatus("Contenu chargé.");
  } catch (error) {
    console.error("Erreur de chargement :", error);

    showStatus(
      "Impossible de charger le contenu. Vérifie la connexion et les droits d'accès.",
      "error"
    );
  }
}

/* =========================================================
   SAUVEGARDE — CONTRÔLE ET GESTION DES ERREURS
========================================================= */

async function saveSection(section) {
  if (savingSections.has(section)) {
    return;
  }

  if (!(section in currentData)) {
    showStatus("Section introuvable.", "error");
    return;
  }

  const button = document.querySelector(
    "#sectionEditor button.primary"
  );

  savingSections.add(section);

  if (button) {
    button.disabled = true;
    button.textContent = "⏳ Enregistrement...";
  }

  try {
    // Copie exacte de ce qui sera envoyé.
    const contentToSave = clone(currentData[section]);

    const { data, error } = await window.supabaseClient
      .from("site_content")
      .update({
        content: contentToSave
      })
      .eq("section", section)
      .select("section");

    if (error) {
      throw error;
    }

    // On attend exactement une ligne mise à jour.
    if (!data || data.length !== 1) {
      throw new Error(
        "Aucune ligne mise à jour. Vérifie les droits d'administration et les politiques RLS."
      );
    }

    // La référence devient celle de la version envoyée,
    // et non celle d'éventuelles modifications ultérieures.
    savedSnapshots.set(
      section,
      snapshot(contentToSave)
    );

    if (isDirty(section)) {
      showStatus(
        "La version envoyée est enregistrée, mais des modifications supplémentaires restent à sauvegarder.",
        "error"
      );
    } else {
      showStatus(
        `✅ ${SECTION_LABELS[section] || section} enregistré.`
      );
    }
  } catch (error) {
    console.error("Erreur de sauvegarde :", error);

    showStatus(
      "Échec de la sauvegarde. Les modifications restent dans l'éditeur. Vérifie la connexion et les droits avant de réessayer.",
      "error"
    );
  } finally {
    savingSections.delete(section);

    if (button && button.isConnected) {
      button.disabled = false;
      button.textContent = "💾 Enregistrer";
    }
  }
}

/* =========================================================
   VÉRIFICATION DU COMPTE ADMINISTRATEUR
========================================================= */

async function checkAdmin() {
  try {
    const {
      data: { session },
      error: sessionError
    } = await window.supabaseClient.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!session) {
      currentUser = null;
      showLogin();
      return;
    }

    const { data, error } = await window.supabaseClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error || !data) {
      await window.supabaseClient.auth.signOut();

      currentUser = null;
      currentData = {};
      savedSnapshots.clear();
      currentSection = null;

      showLogin();

      showStatus(
        "Accès administrateur refusé.",
        "error"
      );

      return;
    }

    currentUser = session.user;

    showAdmin();

    await loadSections();
  } catch (error) {
    console.error("Erreur de vérification admin :", error);

    showLogin();

    showStatus(
      "Impossible de vérifier la session. Réessaie après avoir vérifié ta connexion.",
      "error"
    );
  }
}

function showLogin() {
  const login = document.getElementById("loginSection");
  const admin = document.getElementById("adminSection");

  if (login) {
    login.classList.remove("hidden");
  }

  if (admin) {
    admin.classList.add("hidden");
  }
}

function showAdmin() {
  const login = document.getElementById("loginSection");
  const admin = document.getElementById("adminSection");

  if (login) {
    login.classList.add("hidden");
  }

  if (admin) {
    admin.classList.remove("hidden");
  }
}

/* =========================================================
   CONNEXION
========================================================= */

async function login(email, password) {
  try {
    const { error } = await window.supabaseClient.auth
      .signInWithPassword({
        email,
        password
      });

    if (error) {
      showStatus(
        "Connexion impossible. Vérifie tes identifiants.",
        "error"
      );

      console.error("Erreur de connexion :", error);
      return;
    }

    await checkAdmin();
  } catch (error) {
    console.error("Erreur de connexion :", error);

    showStatus(
      "Une erreur est survenue pendant la connexion.",
      "error"
    );
  }
}

/* =========================================================
   INITIALISATION DE L'INTERFACE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (adminInitialized) return;

  adminInitialized = true;

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async event => {
      event.preventDefault();

      const email = document
        .getElementById("email")
        ?.value
        .trim();

      const password = document
        .getElementById("password")
        ?.value;

      if (!email || !password) {
        showStatus(
          "Veuillez remplir les deux champs.",
          "error"
        );

        return;
      }

      await login(email, password);
    });
  }

  /* -------------------------------------------------------
     DÉCONNEXION — DEMANDE DE CONFIRMATION
  ------------------------------------------------------- */

  const logout = document.getElementById("logoutBtn");

  if (logout) {
    logout.addEventListener("click", async event => {
      event.preventDefault();

      if (!confirmLeaveAdmin()) {
        return;
      }

      try {
        const { error } =
          await window.supabaseClient.auth.signOut();

        if (error) {
          throw error;
        }

        currentUser = null;
        currentData = {};
        savedSnapshots.clear();
        currentSection = null;

        showLogin();

        showStatus("Déconnexion effectuée.");
      } catch (error) {
        console.error("Erreur de déconnexion :", error);

        showStatus(
          "La déconnexion a échoué. Réessaie.",
          "error"
        );
      }
    });
  }

  /* -------------------------------------------------------
     CONSTRUCTION DE L'INTERFACE CMS
  ------------------------------------------------------- */

  const adminSection =
    document.getElementById("adminSection");

  if (adminSection) {
    const existing =
      document.getElementById("cmsLayout");

    if (!existing) {
      const layout = document.createElement("div");
      layout.id = "cmsLayout";

      Object.assign(layout.style, {
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: "25px",
        alignItems: "start"
      });

      /* SIDEBAR */

      const sidebar = document.createElement("div");

      Object.assign(sidebar.style, {
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "15px",
        position: "sticky",
        top: "20px"
      });

      const sidebarTitle = document.createElement("h3");
      sidebarTitle.textContent = "Sections";

      Object.assign(sidebarTitle.style, {
        margin: "5px 8px 15px"
      });

      const nav = document.createElement("div");
      nav.id = "sectionNav";

      sidebar.append(sidebarTitle, nav);

      /* ÉDITEUR */

      const editorCard = document.createElement("div");

      Object.assign(editorCard.style, {
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "25px"
      });

      const editor = document.createElement("div");
      editor.id = "sectionEditor";

      editorCard.appendChild(editor);
      layout.append(sidebar, editorCard);
      adminSection.appendChild(layout);

      /* STYLE */

      const style = document.createElement("style");

      style.textContent = `
        @media (max-width: 800px) {
          #cmsLayout {
            grid-template-columns: 1fr !important;
          }

          #sectionNav {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
          }

          #cmsLayout > div:first-child {
            position: static !important;
          }
        }

        .cms-field label {
          font-size: 14px;
        }

        .cms-field input:focus,
        .cms-field textarea:focus,
        .cms-field select:focus {
          outline: none;
          border-color: #111827 !important;
          box-shadow: 0 0 0 3px rgba(17,24,39,.08);
        }

        .secondary {
          background: #e5e7eb;
          color: #111827;
          border: 0;
          border-radius: 8px;
          padding: 9px 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .secondary:hover {
          background: #d1d5db;
        }

        .primary {
          background: #111827;
          color: white;
          border: 0;
          border-radius: 8px;
          padding: 11px 18px;
          font-weight: 600;
          cursor: pointer;
        }

        .primary:hover {
          opacity: .9;
        }

        .danger {
          background: #fee2e2;
          color: #991b1b;
          border: 0;
          border-radius: 8px;
          padding: 9px 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .danger:hover {
          background: #fecaca;
        }

        button:disabled {
          opacity: .6;
          cursor: wait;
        }
      `;

      document.head.appendChild(style);
    }
  }

  // Vérifier la session et charger le contenu.
  checkAdmin();
});
