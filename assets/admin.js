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
   MESSAGES
========================================================= */

const showLoginStatus = (message, type = "error") => {
  loginStatus.textContent = message;
  loginStatus.className = `status ${type}`;
};


/* =========================================================
   AFFICHAGE LOGIN / ADMIN
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
  } = await window.supabaseClient.auth.getUser();

  if (!user) {
    showLogin();
    return false;
  }

  const { data, error } =
    await window.supabaseClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

  if (error || !data) {

    await window.supabaseClient.auth.signOut();

    showLoginStatus(
      "Accès refusé : ce compte n'est pas administrateur."
    );

    return false;
  }

  showAdmin();

  return true;
};


/* =========================================================
   CREATION D'UN CHAMP
========================================================= */

const createField = (
  labelText,
  value,
  options = {}
) => {

  const wrapper = document.createElement("div");

  const label = document.createElement("label");
  label.textContent = labelText;

  let field;

  if (options.textarea) {

    field = document.createElement("textarea");

    if (options.small) {
      field.style.minHeight = "120px";
    }

  } else {

    field = document.createElement("input");
    field.type = "text";
  }

  field.value = value || "";

  wrapper.appendChild(label);
  wrapper.appendChild(field);

  return {
    wrapper,
    field
  };
};


/* =========================================================
   INTERFACE PROFILE
========================================================= */

const renderProfileEditor = (row) => {

  const card = document.createElement("section");
  card.className = "card";

  const title = document.createElement("h2");
  title.textContent = "Profil";

  const description = document.createElement("p");
  description.className = "muted";
  description.textContent =
    "Modifiez les informations principales de votre profil.";

  card.appendChild(title);
  card.appendChild(description);


  /* -------------------------------------------------------
     NOM
  ------------------------------------------------------- */

  const nameField =
    createField(
      "Nom",
      row.content.name
    );

  card.appendChild(nameField.wrapper);


  /* -------------------------------------------------------
     TITRES
  ------------------------------------------------------- */

  const titleFr =
    createField(
      "Titre — Français",
      row.content.title?.fr
    );

  const titleEn =
    createField(
      "Title — English",
      row.content.title?.en
    );

  card.appendChild(titleFr.wrapper);
  card.appendChild(titleEn.wrapper);


  /* -------------------------------------------------------
     TAGLINE
  ------------------------------------------------------- */

  const taglineFr =
    createField(
      "Tagline — Français",
      row.content.tagline?.fr,
      { textarea: true, small: true }
    );

  const taglineEn =
    createField(
      "Tagline — English",
      row.content.tagline?.en,
      { textarea: true, small: true }
    );

  card.appendChild(taglineFr.wrapper);
  card.appendChild(taglineEn.wrapper);


  /* -------------------------------------------------------
     SUBTITLE / DESCRIPTION COURTE
  ------------------------------------------------------- */

  const subFr =
    createField(
      "Description courte — Français",
      row.content.sub?.fr,
      { textarea: true }
    );

  const subEn =
    createField(
      "Short description — English",
      row.content.sub?.en,
      { textarea: true }
    );

  card.appendChild(subFr.wrapper);
  card.appendChild(subEn.wrapper);


  /* -------------------------------------------------------
     ABOUT
  ------------------------------------------------------- */

  const aboutTitle =
    document.createElement("h3");

  aboutTitle.textContent =
    "Présentation";

  card.appendChild(aboutTitle);


  const aboutFields = [];

  const aboutData =
    Array.isArray(row.content.about)
      ? row.content.about
      : [];


  for (let i = 0; i < 3; i++) {

    const blockTitle =
      document.createElement("h4");

    blockTitle.textContent =
      `Paragraphe ${i + 1}`;

    card.appendChild(blockTitle);


    const fr =
      createField(
        `Français — paragraphe ${i + 1}`,
        aboutData[i]?.fr,
        { textarea: true }
      );

    const en =
      createField(
        `English — paragraph ${i + 1}`,
        aboutData[i]?.en,
        { textarea: true }
      );

    card.appendChild(fr.wrapper);
    card.appendChild(en.wrapper);

    aboutFields.push({
      fr: fr.field,
      en: en.field
    });
  }


  /* -------------------------------------------------------
     VISION
  ------------------------------------------------------- */

  const visionTitle =
    document.createElement("h3");

  visionTitle.textContent =
    "Vision";

  card.appendChild(visionTitle);


  const visionFr =
    createField(
      "Vision — Français",
      row.content.vision?.fr,
      { textarea: true }
    );

  const visionEn =
    createField(
      "Vision — English",
      row.content.vision?.en,
      { textarea: true }
    );

  card.appendChild(visionFr.wrapper);
  card.appendChild(visionEn.wrapper);


  /* -------------------------------------------------------
     METHODE
  ------------------------------------------------------- */

  const methodTitle =
    document.createElement("h3");

  methodTitle.textContent =
    "Méthode";

  card.appendChild(methodTitle);


  const methodFr =
    createField(
      "Méthode — Français",
      row.content.method?.fr,
      { textarea: true }
    );

  const methodEn =
    createField(
      "Method — English",
      row.content.method?.en,
      { textarea: true }
    );

  card.appendChild(methodFr.wrapper);
  card.appendChild(methodEn.wrapper);


  /* -------------------------------------------------------
     BOUTON ENREGISTRER
  ------------------------------------------------------- */

  const saveButton =
    document.createElement("button");

  saveButton.type = "button";
  saveButton.className = "primary";
  saveButton.textContent =
    "Enregistrer les modifications";


  const status =
    document.createElement("div");

  status.className = "status";


  saveButton.addEventListener(
    "click",
    async () => {

      saveButton.disabled = true;
      saveButton.textContent =
        "Enregistrement…";

      status.className = "status";
      status.textContent = "";


      try {

        const newContent = {

          ...row.content,

          name:
            nameField.field.value.trim(),

          title: {
            fr: titleFr.field.value.trim(),
            en: titleEn.field.value.trim()
          },

          tagline: {
            fr: taglineFr.field.value.trim(),
            en: taglineEn.field.value.trim()
          },

          sub: {
            fr: subFr.field.value.trim(),
            en: subEn.field.value.trim()
          },

          about:
            aboutFields.map(item => ({
              fr: item.fr.value.trim(),
              en: item.en.value.trim()
            })),

          vision: {
            fr: visionFr.field.value.trim(),
            en: visionEn.field.value.trim()
          },

          method: {
            fr: methodFr.field.value.trim(),
            en: methodEn.field.value.trim()
          }
        };


        const { error } =
          await window.supabaseClient
            .from("site_content")
            .update({
              content: newContent
            })
            .eq("section", "profile");


        if (error) {
          throw error;
        }


        row.content = newContent;


        status.className =
          "status success";

        status.textContent =
          "✓ Profil enregistré avec succès.";


      } catch (error) {

        console.error(error);

        status.className =
          "status error";

        status.textContent =
          `Erreur : ${error.message}`;

      } finally {

        saveButton.disabled = false;

        saveButton.textContent =
          "Enregistrer les modifications";
      }

    }
  );


  card.appendChild(saveButton);
  card.appendChild(status);

  return card;
};


/* =========================================================
   INTERFACE JSON POUR LES AUTRES SECTIONS
========================================================= */

const renderJsonEditor = (row) => {

  const card = document.createElement("section");
  card.className = "card";

  const title = document.createElement("h2");
  title.textContent = row.section;

  const info = document.createElement("p");
  info.className = "muted";

  info.textContent =
    `Dernière modification : ${
      new Date(row.updated_at)
        .toLocaleString("fr-FR")
    }`;


  const textarea =
    document.createElement("textarea");

  textarea.value =
    JSON.stringify(
      row.content,
      null,
      2
    );

  textarea.dataset.section =
    row.section;


  const saveButton =
    document.createElement("button");

  saveButton.type = "button";
  saveButton.className = "primary";
  saveButton.textContent =
    "Enregistrer";


  const status =
    document.createElement("div");

  status.className =
    "status";


  saveButton.addEventListener(
    "click",
    async () => {

      saveButton.disabled = true;
      saveButton.textContent =
        "Enregistrement…";

      status.className =
        "status";

      status.textContent =
        "";


      try {

        const content =
          JSON.parse(
            textarea.value
          );


        const { error } =
          await window.supabaseClient
            .from("site_content")
            .update({
              content
            })
            .eq(
              "section",
              row.section
            );


        if (error) {
          throw error;
        }


        status.className =
          "status success";

        status.textContent =
          "✓ Modification enregistrée.";


      } catch (error) {

        console.error(error);

        status.className =
          "status error";

        status.textContent =
          `Erreur : ${error.message}`;

      } finally {

        saveButton.disabled = false;

        saveButton.textContent =
          "Enregistrer";
      }

    }
  );


  card.appendChild(title);
  card.appendChild(info);
  card.appendChild(textarea);
  card.appendChild(saveButton);
  card.appendChild(status);

  return card;
};


/* =========================================================
   CHARGEMENT DES SECTIONS
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


  sectionsContainer.innerHTML = "";


  data.forEach(row => {

    if (row.section === "profile") {

      sectionsContainer.appendChild(
        renderProfileEditor(row)
      );

    } else {

      sectionsContainer.appendChild(
        renderJsonEditor(row)
      );
    }

  });
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


    const { error } =
      await window.supabaseClient.auth
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
      .getElementById("password")
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


    sectionsContainer.innerHTML = "";

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
