(async () => {
  // data.js reste notre sauvegarde de secours
  const fallbackData = window.DATA;

  try {
    if (!window.supabaseClient) {
      console.warn("Supabase non disponible. Utilisation de data.js.");
      window.DATA = fallbackData;
      window.dispatchEvent(new Event("content-ready"));
      return;
    }

    const { data, error } = await window.supabaseClient
      .from("site_content")
      .select("section, content");

    if (error) {
      throw error;
    }

    if (!data || !data.length) {
      console.warn("Aucun contenu Supabase trouvé. Utilisation de data.js.");
      window.DATA = fallbackData;
      window.dispatchEvent(new Event("content-ready"));
      return;
    }

    const remoteData = {};

    data.forEach(row => {
      remoteData[row.section] = row.content;
    });

    // On ne remplace que si le contenu Supabase est complet
    const requiredSections = [
      "settings",
      "profile",
      "loop",
      "categories",
      "expertises",
      "experiences",
      "projects",
      "achievements",
      "research",
      "productions",
      "tools",
      "formalab",
      "links"
    ];

    const isComplete = requiredSections.every(
      section =>
        Object.prototype.hasOwnProperty.call(
          remoteData,
          section
        )
    );

    if (!isComplete) {
      console.warn(
        "Contenu Supabase incomplet. Utilisation de data.js."
      );

      window.DATA = fallbackData;
      window.dispatchEvent(new Event("content-ready"));
      return;
    }

    // Supabase devient la source principale
    window.DATA = remoteData;

    console.log(
      "✅ Contenu chargé depuis Supabase."
    );

    window.dispatchEvent(new Event("content-ready"));

  } catch (error) {

    console.error(
      "Erreur lors du chargement Supabase :",
      error
    );

    // Sécurité : le site continue de fonctionner avec data.js
    window.DATA = fallbackData;

    window.dispatchEvent(new Event("content-ready"));
  }
})();
