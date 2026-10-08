const sectionsContainer =
  document.getElementById("sections");

const loginSection =
  document.getElementById("loginSection");

const adminSection =
  document.getElementById("adminSection");

const loginForm =
  document.getElementById("loginForm");

const loginStatus =
  document.getElementById("loginStatus");

const logoutBtn =
  document.getElementById("logoutBtn");


/* =========================================================
   CONFIGURATION
========================================================= */

const sectionLabels = {
  settings: "Paramètres",
  profile: "Profil",
  loop: "Approche professionnelle",
  categories: "Catégories",
  expertises: "Expertises",
  experiences: "Expériences professionnelles",
  projects: "Projets / Réalisations",
  achievements: "Réalisations / Achievements",
  research: "Recherche",
  productions: "Productions",
  tools: "Outils",
  formalab: "FORMA LAB",
  links: "Liens & Contact"
};


/* =========================================================
   MESSAGES
========================================================= */

const showLoginStatus = (
  message,
  type = "error"
) => {
  loginStatus.textContent = message;
  loginStatus.className =
    `status ${type}`;
};


/* =========================================================
   LOGIN / ADMIN
========================================================= */

const showAdmin = () => {
  loginSection.classList.add("hidden");
  adminSection.classList.remove("hidden");
};

const showLogin = () => {
  adminSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
};


/* =========================================================
   VERIFICATION ADMIN
========================================================= */

const checkAdmin = async () => {

  const {
    data: { user }
  } =
    await window.supabaseClient.auth.getUser();

  if (!user) {
    showLogin();
    return false;
  }

  const {
    data,
    error
  } =
    await window.supabaseClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

  if (error || !data) {

    await window.supabaseClient
      .auth
      .signOut();

    showLoginStatus(
      "Accès refusé : ce compte n'est pas administrateur."
    );

    return false;
  }

  showAdmin();

  return true;
};


/* =========================================================
   UTILITAIRES
========================================================= */

const deepClone = value => {

  if (
    value === null ||
    value === undefined
  ) {
    return value;
  }

  return JSON.parse(
    JSON.stringify(value)
  );
};


const isObject = value =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);


const isPrimitive = value =>
  value === null ||
  typeof value !== "object";


const formatLabel = key => {

  const labels = {

    fr: "Français",

    en: "English",

    n: "Nom",

    id: "Identifiant",

    title: "Titre",

    tagline: "Accroche",

    sub: "Description courte",

    about: "Présentation",

    vision: "Vision",

    method: "Méthode",

    org: "Organisation",

    role: "Poste",

    dates: "Période",

    context: "Contexte",

    resp: "Responsabilités",

    projects: "Projets",

    achievements: "Réalisations",

    impact: "Impact",

    items: "Éléments",

    proof: "Preuve / projet associé",

    cat: "Catégories",

    description: "Description",

    link: "Lien",

    url: "URL",

    image: "Image",

    name: "Nom",

    category: "Catégorie",

    type: "Type",

    location: "Lieu",

    email: "E-mail",

    phone: "Téléphone",

    linkedin: "LinkedIn",

    youtube: "YouTube"

  };

  if (labels[key]) {
    return labels[key];
  }

  return key
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, char =>
      char.toUpperCase()
    );
};


/* =========================================================
   CREATION D'UN CHAMP PRIMITIF
========================================================= */

const createPrimitiveField = ({
  label,
  value,
  onChange,
  multiline = false
}) => {

  const wrapper =
    document.createElement("div");

  wrapper.style.marginBottom = "16px";

  const labelElement =
    document.createElement("label");

  labelElement.textContent =
    label;

  labelElement.style.display =
    "block";

  labelElement.style.marginBottom =
    "7px";

  labelElement.style.fontWeight =
    "600";


  let input;

  if (multiline) {

    input =
      document.createElement("textarea");

    input.style.minHeight =
      "110px";

  } else {

    input =
      document.createElement("input");

    input.type = "text";
  }


  input.value =
    value === null ||
    value === undefined
      ? ""
      : String(value);


  input.addEventListener(
    "input",
    () => {

      onChange(
        input.value
      );

    }
  );


  wrapper.appendChild(
    labelElement
  );

  wrapper.appendChild(
    input
  );

  return wrapper;
};


/* =========================================================
   EDITION D'UN OBJET
========================================================= */

const renderObject = (
  object,
  onChange,
  level = 0
) => {

  const container =
    document.createElement("div");

  container.style.marginLeft =
    level > 0 ? "12px" : "0";


  Object.keys(object)
    .forEach(key => {

      const value =
        object[key];


      /* -----------------------------------------------
         OBJET IMBRIQUE
      ----------------------------------------------- */

      if (isObject(value)) {

        const group =
          document.createElement("div");

        group.style.border =
          "1px solid #e5e7eb";

        group.style.borderRadius =
          "10px";

        group.style.padding =
          "18px";

        group.style.marginBottom =
          "18px";


        const heading =
          document.createElement("h3");

        heading.textContent =
          formatLabel(key);

        heading.style.marginTop =
          "0";

        heading.style.marginBottom =
          "15px";


        group.appendChild(
          heading
        );


        const child =
          renderObject(
            value,
            newValue => {

              object[key] =
                newValue;

              onChange(object);

            },
            level + 1
          );


        group.appendChild(child);

        container.appendChild(group);

        return;
      }


      /* -----------------------------------------------
         TABLEAU
      ----------------------------------------------- */

      if (Array.isArray(value)) {

        const group =
          document.createElement("div");

        group.style.border =
          "1px solid #e5e7eb";

        group.style.borderRadius =
          "10px";

        group.style.padding =
          "18px";

        group.style.marginBottom =
          "18px";


        const heading =
          document.createElement("h3");

        heading.textContent =
          formatLabel(key);


        group.appendChild(
          heading
        );


        const list =
          document.createElement("div");


        value.forEach(
          (item, index) => {

            const itemWrapper =
              document.createElement("div");

            itemWrapper.style.border =
              "1px solid #f0f0f0";

            itemWrapper.style.borderRadius =
              "8px";

            itemWrapper.style.padding =
              "14px";

            itemWrapper.style.marginBottom =
              "12px";


            const itemTitle =
              document.createElement("strong");

            itemTitle.textContent =
              `Élément ${index + 1}`;

            itemWrapper.appendChild(
              itemTitle
            );


            if (isObject(item)) {

              itemWrapper.appendChild(
                renderObject(
                  item,
                  newItem => {

                    value[index] =
                      newItem;

                    onChange(object);

                  },
                  level + 1
                )
              );

            } else {

              const input =
                document.createElement(
                  "textarea"
                );

              input.value =
                item === null
                  ? ""
                  : String(item);

              input.style.minHeight =
                "80px";


              input.addEventListener(
                "input",
                () => {

                  value[index] =
                    input.value;

                  onChange(object);

                }
              );


              itemWrapper.appendChild(
                input
              );
            }


            const deleteButton =
              document.createElement(
                "button"
              );

            deleteButton.type =
              "button";

            deleteButton.className =
              "danger";

            deleteButton.textContent =
              "Supprimer";


            deleteButton.style.marginTop =
              "10px";


            deleteButton.addEventListener(
              "click",
              () => {

                value.splice(
                  index,
                  1
                );

                renderCurrentSection();
              }
            );


            itemWrapper.appendChild(
              deleteButton
            );


            list.appendChild(
              itemWrapper
            );

          }
        );


        group.appendChild(list);


        const addButton =
          document.createElement(
            "button"
          );

        addButton.type =
          "button";

        addButton.className =
          "secondary";

        addButton.textContent =
          "+ Ajouter";


        addButton.addEventListener(
          "click",
          () => {

            let newItem = "";


            if (value.length > 0) {

              newItem =
                deepClone(
                  value[0]
                );

            }


            value.push(
              newItem
            );

            renderCurrentSection();
          }
        );


        group.appendChild(
          addButton
        );


        container.appendChild(
          group
        );

        return;
      }


      /* -----------------------------------------------
         CHAMP TEXTE
      ----------------------------------------------- */

      const field =
        createPrimitiveField({

          label:
            formatLabel(key),

          value,

          multiline:
            typeof value === "string" &&
            value.length > 120,

          onChange:
            newValue => {

              object[key] =
                newValue;

              onChange(object);
            }

        });


      container.appendChild(
        field
      );

    });


  return container;
};


/* =========================================================
   VARIABLES DE SECTION
========================================================= */

let currentRows = [];

let currentSectionRow = null;


/* =========================================================
   RENDRE UNE SECTION
========================================================= */

const renderSection = row => {

  currentSectionRow =
    row;


  const card =
    document.createElement(
      "section"
    );

  card.className =
    "card";


  const title =
    document.createElement(
      "h2"
    );

  title.textContent =
    sectionLabels[row.section] ||
    formatLabel(row.section);


  const info =
    document.createElement(
      "p"
    );

  info.className =
    "muted";

  info.textContent =
    `Dernière modification : ${
      new Date(
        row.updated_at
      ).toLocaleString("fr-FR")
    }`;


  card.appendChild(title);
  card.appendChild(info);


  const editor =
    document.createElement(
      "div"
    );


  const workingCopy =
    deepClone(
      row.content
    );


  const refreshEditor =
    () => {

      editor.innerHTML = "";

      editor.appendChild(
        renderObject(
          workingCopy,
          newValue => {

            row.content =
              newValue;

          }
        )
      );
    };


  refreshEditor();


  card.appendChild(
    editor
  );


  const saveButton =
    document.createElement(
      "button"
    );

  saveButton.type =
    "button";

  saveButton.className =
    "primary";

  saveButton.textContent =
    "Enregistrer les modifications";


  const status =
    document.createElement(
      "div"
    );

  status.className =
    "status";


  saveButton.addEventListener(
    "click",
    async () => {

      saveButton.disabled =
        true;

      saveButton.textContent =
        "Enregistrement…";

      status.className =
        "status";

      status.textContent =
        "";


      try {

        const {
          error
        } =
          await window.supabaseClient
            .from("site_content")
            .update({
              content:
                workingCopy
            })
            .eq(
              "section",
              row.section
            );


        if (error) {
          throw error;
        }


        row.content =
          deepClone(
            workingCopy
          );


        status.className =
          "status success";

        status.textContent =
          "✓ Modifications enregistrées avec succès.";


      } catch (error) {

        console.error(
          error
        );

        status.className =
          "status error";

        status.textContent =
          `Erreur : ${error.message}`;

      } finally {

        saveButton.disabled =
          false;

        saveButton.textContent =
          "Enregistrer les modifications";
      }

    }
  );


  card.appendChild(
    saveButton
  );

  card.appendChild(
    status
  );


  return card;
};


/* =========================================================
   VARIABLE DE RAFRAICHISSEMENT
========================================================= */

const renderCurrentSection = () => {

  if (!currentSectionRow) {
    return;
  }

  loadSections();
};


/* =========================================================
   CHARGER TOUTES LES SECTIONS
========================================================= */

const loadSections = async () => {

  sectionsContainer.innerHTML = `
    <div class="card">
      Chargement du contenu…
    </div>
  `;


  const {
    data,
    error
  } =
    await window.supabaseClient
      .from("site_content")
      .select(
        "section, content, updated_at"
      )
      .order("id");


  if (error) {

    sectionsContainer.innerHTML = `
      <div class="card">
        <strong>Erreur :</strong>
        ${error.message}
      </div>
    `;

    return;
  }


  currentRows =
    data;


  sectionsContainer.innerHTML =
    "";


  data.forEach(
    row => {

      sectionsContainer.appendChild(
        renderSection(row)
      );

    }
  );
};


/* =========================================================
   CONNEXION
========================================================= */

loginForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const email =
      document
        .getElementById("email")
        .value
        .trim();


    const password =
      document
        .getElementById("password")
        .value;


    showLoginStatus(
      "Connexion…",
      "success"
    );


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

      showLoginStatus(
        "Connexion impossible : " +
        error.message
      );

      return;
    }


    document
      .getElementById(
        "password"
      )
      .value = "";


    const authorized =
      await checkAdmin();


    if (authorized) {
      await loadSections();
    }

  }
);


/* =========================================================
   DECONNEXION
========================================================= */

logoutBtn.addEventListener(
  "click",
  async () => {

    await window.supabaseClient
      .auth
      .signOut();


    sectionsContainer.innerHTML =
      "";

    showLogin();

    showLoginStatus(
      "Vous êtes déconnecté.",
      "success"
    );

  }
);


/* =========================================================
   INITIALISATION
========================================================= */

(async () => {

  const authorized =
    await checkAdmin();

  if (authorized) {
    await loadSections();
  }

})();
