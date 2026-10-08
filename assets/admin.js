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


const showLoginStatus = (message, type = "error") => {

  loginStatus.textContent = message;

  loginStatus.className =
    `status ${type}`;

};


const showAdmin = () => {

  loginSection.classList.add("hidden");

  adminSection.classList.remove("hidden");

};


const showLogin = () => {

  adminSection.classList.add("hidden");

  loginSection.classList.remove("hidden");

};


const checkAdmin = async () => {

  const {
    data: {
      user
    }
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

    await window.supabaseClient.auth.signOut();

    showLoginStatus(
      "Accès refusé : ce compte n'est pas administrateur."
    );

    return false;
  }

  showAdmin();

  return true;
};


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
      .select("section, content, updated_at")
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

    const card =
      document.createElement("section");

    card.className = "card";

    const title =
      document.createElement("h2");

    title.textContent =
      row.section;

    const info =
      document.createElement("p");

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

    saveButton.type =
      "button";

    saveButton.className =
      "primary";

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

        status.textContent = "";

        try {

          const content =
            JSON.parse(
              textarea.value
            );

          const {
            error
          } =
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

          saveButton.disabled =
            false;

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

    sectionsContainer.appendChild(card);

  });

};


loginForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    const email =
      document.getElementById("email")
        .value
        .trim();

    const password =
      document.getElementById("password")
        .value;

    showLoginStatus(
      "Connexion…",
      "success"
    );

    const {
      error
    } =
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

    document.getElementById("password")
      .value = "";

    const authorized =
      await checkAdmin();

    if (authorized) {
      await loadSections();
    }

  }
);


logoutBtn.addEventListener(
  "click",
  async () => {

    await window.supabaseClient.auth.signOut();

    sectionsContainer.innerHTML = "";

    showLogin();

    showLoginStatus(
      "Vous êtes déconnecté.",
      "success"
    );

  }
);


(async () => {

  const authorized =
    await checkAdmin();

  if (authorized) {
    await loadSections();
  }

})();
