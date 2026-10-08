/* =========================================================
   ADMIN CMS — ABDELAZIZ TALHAOUI
   Version finale — Supabase + interface structurée
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
  title: "Titre professionnel",
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
  title: "Titre",
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

let currentData = {};
let currentSection = null;
let currentUser = null;


/* =========================================================
   UTILITAIRES
========================================================= */

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isObject(value) {
  return value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);
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
    .replace(/^./, c => c.toUpperCase());
}

function languageLabel(key) {
  if (key === "fr") return "🇫🇷 Français";
  if (key === "en") return "🇬🇧 English";
  return null;
}

function showStatus(message, type = "success") {

  let box =
    document.getElementById("globalStatus");

  if (!box) {

    box =
      document.createElement("div");

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
    type === "error"
      ? "#fee2e2"
      : "#dcfce7";

  box.style.color =
    type === "error"
      ? "#991b1b"
      : "#166534";

  clearTimeout(box._timer);

  box._timer =
    setTimeout(() => {
      box.remove();
    }, 3500);
}


/* =========================================================
   PATH
========================================================= */

function parsePath(path) {

  return path
    .split(".")
    .map(part =>
      /^\d+$/.test(part)
        ? Number(part)
        : part
    );
}

function setPathValue(obj, path, value) {

  const parts =
    parsePath(path);

  let target = obj;

  for (
    let i = 0;
    i < parts.length - 1;
    i++
  ) {
    target =
      target[parts[i]];
  }

  target[
    parts[parts.length - 1]
  ] = value;
}


/* =========================================================
   CHAMP PRIMITIF
========================================================= */

function createPrimitiveField(
  value,
  path,
  options = {}
) {

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "cms-field";

  const key =
    path.split(".").pop();

  const label =
    document.createElement("label");

  label.textContent =
    options.label ||
    labelize(key);

  label.style.display =
    "block";

  label.style.fontWeight =
    "600";

  label.style.color =
    "#374151";

  let input;

  const isLong =
    options.long ||
    String(value ?? "").length > 180;

  if (typeof value === "boolean") {

    input =
      document.createElement("select");

    const yes =
      document.createElement("option");

    yes.value = "true";
    yes.textContent = "Oui";

    const no =
      document.createElement("option");

    no.value = "false";
    no.textContent = "Non";

    input.append(yes, no);

    input.value =
      String(value);

  } else if (isLong) {

    input =
      document.createElement("textarea");

    input.rows = 5;

    input.value =
      value ?? "";

  } else {

    input =
      document.createElement("input");

    input.type =
      "text";

    input.value =
      value ?? "";
  }

  input.dataset.path =
    path;

  Object.assign(input.style, {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    font: "inherit",
    marginTop: "7px",
    marginBottom: "15px",
    boxSizing: "border-box",
    background: "#fff"
  });

  input.addEventListener(
    "input",
    () => {

      setPathValue(
        currentData,
        path,
        typeof value === "boolean"
          ? input.value === "true"
          : input.value
      );
    }
  );

  wrapper.append(
    label,
    input
  );

  return wrapper;
}


/* =========================================================
   OBJET MULTILINGUE FR / EN
========================================================= */

function renderLanguageObject(
  obj,
  path,
  title
) {

  const container =
    document.createElement("div");

  container.className =
    "cms-language-group";

  Object.assign(container.style, {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "18px",
    marginBottom: "18px",
    background: "#fafafa"
  });

  if (title) {

    const heading =
      document.createElement("h3");

    heading.textContent =
      title;

    Object.assign(heading.style, {
      margin: "0 0 18px",
      fontSize: "17px",
      color: "#111827"
    });

    container.appendChild(
      heading
    );
  }

  ["fr", "en"].forEach(lang => {

    if (
      !Object.prototype.hasOwnProperty.call(
        obj,
        lang
      )
    ) return;

    const languageBox =
      document.createElement("div");

    Object.assign(languageBox.style, {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "9px",
      padding: "14px",
      marginBottom: "12px"
    });

    const languageTitle =
      document.createElement("div");

    languageTitle.textContent =
      languageLabel(lang);

    Object.assign(languageTitle.style, {
      fontWeight: "700",
      marginBottom: "8px",
      color: "#111827"
    });

    languageBox.appendChild(
      languageTitle
    );

    const value =
      obj[lang];

    const field =
      createPrimitiveField(
        value,
        `${path}.${lang}`,
        {
          label:
            lang === "fr"
              ? "Français"
              : "English",
          long:
            String(value ?? "").length > 120
        }
      );

    languageBox.appendChild(
      field
    );

    container.appendChild(
      languageBox
    );
  });

  return container;
}


/* =========================================================
   TABLEAU DE CHAÎNES
========================================================= */

function renderStringArray(
  array,
  path,
  title
) {

  const container =
    document.createElement("div");

  container.className =
    "cms-array";

  const header =
    document.createElement("div");

  Object.assign(header.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  });

  const h =
    document.createElement("h3");

  h.textContent =
    `${title} (${array.length})`;

  h.style.margin =
    "0";

  const add =
    document.createElement("button");

  add.type =
    "button";

  add.textContent =
    "+ Ajouter";

  add.className =
    "secondary";

  add.onclick = () => {

    array.push("");

    renderCurrentSection();
  };

  header.append(
    h,
    add
  );

  container.appendChild(
    header
  );

  array.forEach(
    (item, index) => {

      const row =
        document.createElement("div");

      Object.assign(row.style, {
        display: "flex",
        gap: "8px",
        marginBottom: "10px",
        alignItems: "flex-start"
      });

      const input =
        document.createElement("textarea");

      input.rows = 2;

      input.value =
        item;

      Object.assign(input.style, {
        flex: "1",
        padding: "10px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        font: "inherit",
        resize: "vertical"
      });

      input.oninput =
        () => {
          array[index] =
            input.value;
        };

      const remove =
        document.createElement("button");

      remove.type =
        "button";

      remove.textContent =
        "×";

      remove.className =
        "danger";

      remove.title =
        "Supprimer";

      remove.onclick =
        () => {

          array.splice(
            index,
            1
          );

          renderCurrentSection();
        };

      row.append(
        input,
        remove
      );

      container.appendChild(
        row
      );
    }
  );

  return container;
}


/* =========================================================
   OBJET
========================================================= */

function renderObject(
  obj,
  path,
  title = ""
) {

  const container =
    document.createElement("div");

  container.className =
    "cms-object";

  if (title) {

    const heading =
      document.createElement("h3");

    heading.textContent =
      title;

    Object.assign(heading.style, {
      marginTop: "0",
      marginBottom: "18px",
      fontSize: "18px",
      color: "#111827"
    });

    container.appendChild(
      heading
    );
  }

  Object.keys(obj)
    .forEach(key => {

      const value =
        obj[key];

      const childPath =
        path
          ? `${path}.${key}`
          : key;

      /* FR / EN */
      if (
        isObject(value) &&
        (
          Object.prototype.hasOwnProperty.call(
            value,
            "fr"
          ) ||
          Object.prototype.hasOwnProperty.call(
            value,
            "en"
          )
        ) &&
        Object.keys(value)
          .every(k =>
            k === "fr" ||
            k === "en"
          )
      ) {

        container.appendChild(
          renderLanguageObject(
            value,
            childPath,
            labelize(key)
          )
        );

        return;
      }

      /* Primitive */
      if (
        isPrimitive(value)
      ) {

        container.appendChild(
          createPrimitiveField(
            value,
            childPath
          )
        );

        return;
      }

      /* Array */
      if (
        Array.isArray(value)
      ) {

        if (
          value.every(
            item =>
              isPrimitive(item)
          )
        ) {

          container.appendChild(
            renderStringArray(
              value,
              childPath,
              labelize(key)
            )
          );

        } else {

          container.appendChild(
            renderComplexArray(
              value,
              childPath,
              labelize(key)
            )
          );
        }

        return;
      }

      /* Objet imbriqué */
      if (
        isObject(value)
      ) {

        const group =
          document.createElement("div");

        Object.assign(group.style, {
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "18px",
          marginBottom: "18px",
          background: "#fafafa"
        });

        group.appendChild(
          renderObject(
            value,
            childPath,
            labelize(key)
          )
        );

        container.appendChild(
          group
        );
      }
    });

  return container;
}


/* =========================================================
   TABLEAU COMPLEXE
========================================================= */

function renderComplexArray(
  array,
  path,
  title
) {

  const container =
    document.createElement("div");

  Object.assign(container.style, {
    marginBottom: "25px"
  });

  const header =
    document.createElement("div");

  Object.assign(header.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  });

  const titleElement =
    document.createElement("h3");

  titleElement.textContent =
    `${title} (${array.length})`;

  titleElement.style.margin =
    "0";

  const add =
    document.createElement("button");

  add.type =
    "button";

  add.className =
    "secondary";

  add.textContent =
    "+ Ajouter";

  add.onclick =
    () => {

      let template = {};

      if (
        array.length > 0
      ) {

        template =
          clone(array[0]);

        clearObjectValues(
          template
        );
      }

      array.push(
        template
      );

      renderCurrentSection();
    };

  header.append(
    titleElement,
    add
  );

  container.appendChild(
    header
  );

  array.forEach(
    (item, index) => {

      const card =
        document.createElement("div");

      Object.assign(card.style, {
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "15px",
        background: "#fff"
      });

      const cardHeader =
        document.createElement("div");

      Object.assign(cardHeader.style, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px"
      });

      const number =
        document.createElement("strong");

      number.textContent =
        `${title} — ${index + 1}`;

      const remove =
        document.createElement("button");

      remove.type =
        "button";

      remove.className =
        "danger";

      remove.textContent =
        "Supprimer";

      remove.onclick =
        () => {

          if (
            !confirm(
              "Supprimer définitivement cet élément ?"
            )
          ) return;

          array.splice(
            index,
            1
          );

          renderCurrentSection();
        };

      cardHeader.append(
        number,
        remove
      );

      card.appendChild(
        cardHeader
      );

      if (
        isObject(item)
      ) {

        card.appendChild(
          renderObject(
            item,
            `${path}.${index}`
          )
        );

      } else {

        card.appendChild(
          createPrimitiveField(
            item,
            `${path}.${index}`
          )
        );
      }

      container.appendChild(
        card
      );
    }
  );

  return container;
}


/* =========================================================
   NETTOYAGE NOUVEL ÉLÉMENT
========================================================= */

function clearObjectValues(
  obj
) {

  Object.keys(obj)
    .forEach(key => {

      if (
        Array.isArray(obj[key])
      ) {

        obj[key] = [];

      } else if (
        isObject(obj[key])
      ) {

        clearObjectValues(
          obj[key]
        );

      } else if (
        typeof obj[key] === "boolean"
      ) {

        obj[key] = false;

      } else {

        obj[key] = "";
      }
    });

  return obj;
}


/* =========================================================
   SECTION
========================================================= */

function renderSection(
  section
) {

  const container =
    document.getElementById(
      "sectionEditor"
    );

  if (!container)
    return;

  container.innerHTML =
    "";

  const data =
    currentData[section];

  if (
    data === undefined
  ) {

    container.innerHTML =
      "<p>Cette section est introuvable.</p>";

    return;
  }

  const title =
    document.createElement("h2");

  title.textContent =
    SECTION_LABELS[section] ||
    labelize(section);

  Object.assign(title.style, {
    marginTop: "0",
    marginBottom: "8px"
  });

  container.appendChild(
    title
  );

  const description =
    document.createElement("p");

  description.textContent =
    "Modifie les informations puis clique sur « Enregistrer ».";

  Object.assign(description.style, {
    color: "#6b7280",
    marginBottom: "25px"
  });

  container.appendChild(
    description
  );

  const editor =
    document.createElement("div");

  if (
    Array.isArray(data)
  ) {

    editor.appendChild(
      renderComplexArray(
        data,
        section,
        SECTION_LABELS[section] ||
        section
      )
    );

  } else if (
    isObject(data)
  ) {

    editor.appendChild(
      renderObject(
        data,
        section
      )
    );

  } else {

    editor.appendChild(
      createPrimitiveField(
        data,
        section
      )
    );
  }

  container.appendChild(
    editor
  );

  const actions =
    document.createElement("div");

  Object.assign(actions.style, {
    display: "flex",
    gap: "10px",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb"
  });

  const save =
    document.createElement("button");

  save.type =
    "button";

  save.className =
    "primary";

  save.textContent =
    "💾 Enregistrer";

  save.onclick =
    () =>
      saveSection(section);

  actions.appendChild(
    save
  );

  container.appendChild(
    actions
  );
}

function renderCurrentSection() {

  if (
    currentSection
  ) {

    renderSection(
      currentSection
    );
  }
}


/* =========================================================
   NAVIGATION
========================================================= */

function renderNavigation() {

  const nav =
    document.getElementById(
      "sectionNav"
    );

  if (!nav)
    return;

  nav.innerHTML =
    "";

  Object.keys(
    SECTION_LABELS
  ).forEach(
    section => {

      const button =
        document.createElement("button");

      button.type =
        "button";

      button.textContent =
        SECTION_LABELS[section];

      Object.assign(button.style, {
        width: "100%",
        textAlign: "left",
        padding: "12px 14px",
        border: "0",
        borderRadius: "8px",
        background:
          section === currentSection
            ? "#111827"
            : "transparent",
        color:
          section === currentSection
            ? "#fff"
            : "#374151",
        cursor: "pointer",
        marginBottom: "4px",
        fontWeight:
          section === currentSection
            ? "600"
            : "400"
      });

      button.onclick =
        () => {

          currentSection =
            section;

          renderNavigation();

          renderSection(
            section
          );
        };

      nav.appendChild(
        button
      );
    }
  );
}


/* =========================================================
   CHARGEMENT SUPABASE
========================================================= */

async function loadSections() {

  showStatus(
    "Chargement du contenu..."
  );

  const {
    data,
    error
  } =
    await window.supabaseClient
      .from("site_content")
      .select(
        "section, content"
      );

  if (error) {

    console.error(
      error
    );

    showStatus(
      "Impossible de charger le contenu.",
      "error"
    );

    return;
  }

  currentData = {};

  data.forEach(
    row => {

      currentData[
        row.section
      ] =
        clone(
          row.content
        );
    }
  );

  if (
    !currentSection
  ) {

    currentSection =
      "profile";
  }

  renderNavigation();

  renderSection(
    currentSection
  );

  showStatus(
    "Contenu chargé."
  );
}


/* =========================================================
   SAUVEGARDE
========================================================= */

async function saveSection(
  section
) {

  const button =
    document.querySelector(
      "#sectionEditor button.primary"
    );

  if (button) {

    button.disabled =
      true;

    button.textContent =
      "⏳ Enregistrement...";
  }

  try {

    const {
      error
    } =
      await window.supabaseClient
        .from("site_content")
        .update({
          content:
            currentData[section]
        })
        .eq(
          "section",
          section
        );

    if (error)
      throw error;

    showStatus(
      `✅ ${
        SECTION_LABELS[section] ||
        section
      } enregistré.`
    );

  } catch (error) {

    console.error(
      error
    );

    showStatus(
      "Erreur lors de l'enregistrement.",
      "error"
    );

  } finally {

    if (button) {

      button.disabled =
        false;

      button.textContent =
        "💾 Enregistrer";
    }
  }
}


/* =========================================================
   ADMIN
========================================================= */

async function checkAdmin() {

  const {
    data: {
      session
    }
  } =
    await window.supabaseClient
      .auth
      .getSession();

  if (!session) {

    showLogin();

    return;
  }

  const {
    data,
    error
  } =
    await window.supabaseClient
      .from("admin_users")
      .select("user_id")
      .eq(
        "user_id",
        session.user.id
      )
      .maybeSingle();

  if (
    error ||
    !data
  ) {

    await window.supabaseClient
      .auth
      .signOut();

    showLogin();

    showStatus(
      "Accès administrateur refusé.",
      "error"
    );

    return;
  }

  currentUser =
    session.user;

  showAdmin();

  await loadSections();
}

function showLogin() {

  const login =
    document.getElementById(
      "loginSection"
    );

  const admin =
    document.getElementById(
      "adminSection"
    );

  if (login)
    login.classList.remove(
      "hidden"
    );

  if (admin)
    admin.classList.add(
      "hidden"
    );
}

function showAdmin() {

  const login =
    document.getElementById(
      "loginSection"
    );

  const admin =
    document.getElementById(
      "adminSection"
    );

  if (login)
    login.classList.add(
      "hidden"
    );

  if (admin)
    admin.classList.remove(
      "hidden"
    );
}


/* =========================================================
   CONNEXION
========================================================= */

async function login(
  email,
  password
) {

  const {
    error
  } =
    await window.supabaseClient
      .auth
      .signInWithPassword({
        email,
        password
      });

  if (error) {

    showStatus(
      error.message,
      "error"
    );

    return;
  }

  await checkAdmin();
}


/* =========================================================
   INITIALISATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const loginForm =
      document.getElementById(
        "loginForm"
      );

    if (loginForm) {

      loginForm.addEventListener(
        "submit",
        async event => {

          event.preventDefault();

          const email =
            document
              .getElementById(
                "email"
              )
              ?.value
              .trim();

          const password =
            document
              .getElementById(
                "password"
              )
              ?.value;

          if (
            !email ||
            !password
          ) {

            showStatus(
              "Veuillez remplir les deux champs.",
              "error"
            );

            return;
          }

          await login(
            email,
            password
          );
        }
      );
    }


    /* Déconnexion */

    const logout =
      document.getElementById(
        "logoutBtn"
      );

    if (logout) {

      logout.addEventListener(
        "click",
        async () => {

          await window.supabaseClient
            .auth
            .signOut();

          currentUser =
            null;

          currentData =
            {};

          currentSection =
            null;

          showLogin();

          showStatus(
            "Déconnexion effectuée."
          );
        }
      );
    }


    /* Interface CMS */

    const adminSection =
      document.getElementById(
        "adminSection"
      );

    if (adminSection) {

      const existing =
        document.getElementById(
          "cmsLayout"
        );

      if (!existing) {

        const layout =
          document.createElement("div");

        layout.id =
          "cmsLayout";

        Object.assign(layout.style, {
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "25px",
          alignItems: "start"
        });


        /* SIDEBAR */

        const sidebar =
          document.createElement("div");

        Object.assign(sidebar.style, {
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "15px",
          position: "sticky",
          top: "20px"
        });

        const sidebarTitle =
          document.createElement("h3");

        sidebarTitle.textContent =
          "Sections";

        Object.assign(
          sidebarTitle.style,
          {
            margin:
              "5px 8px 15px"
          }
        );

        const nav =
          document.createElement("div");

        nav.id =
          "sectionNav";

        sidebar.append(
          sidebarTitle,
          nav
        );


        /* ÉDITEUR */

        const editorCard =
          document.createElement("div");

        Object.assign(editorCard.style, {
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "25px"
        });

        const editor =
          document.createElement("div");

        editor.id =
          "sectionEditor";

        editorCard.appendChild(
          editor
        );

        layout.append(
          sidebar,
          editorCard
        );

        adminSection.appendChild(
          layout
        );


        /* STYLE */

        const style =
          document.createElement("style");

        style.textContent = `

          @media (max-width: 800px) {

            #cmsLayout {
              grid-template-columns:
                1fr !important;
            }

            #sectionNav {
              display: grid;
              grid-template-columns:
                1fr 1fr;
              gap: 4px;
            }

            #cmsLayout >
            div:first-child {
              position:
                static !important;
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
            box-shadow:
              0 0 0 3px
              rgba(17,24,39,.08);
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

        document.head.appendChild(
          style
        );
      }
    }

    checkAdmin();
  }
);
