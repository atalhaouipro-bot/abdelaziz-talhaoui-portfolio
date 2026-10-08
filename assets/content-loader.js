(async () => {
  const fallbackData = window.DATA;

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

  const useFallback = () => {
    console.warn(
      "Utilisation des données locales data.js."
    );

    window.dispatchEvent(
      new Event("content-ready")
    );
  };

  try {
    if (!window.supabaseClient) {
      console.warn(
        "Supabase non disponible."
      );

      useFallback();
      return;
    }

    const { data, error } =
      await window.supabaseClient
        .from("site_content")
        .select("section, content");

    if (error) {
      throw error;
    }

    if (!data || !data.length) {
      console.warn(
        "Aucun contenu Supabase trouvé."
      );

      useFallback();
      return;
    }

    const remoteData = {};

    data.forEach(row => {
      remoteData[row.section] = row.content;
    });

    const isComplete =
      requiredSections.every(
        section =>
          Object.prototype.hasOwnProperty.call(
            remoteData,
            section
          )
      );

    if (!isComplete) {
      console.warn(
        "Contenu Supabase incomplet."
      );

      useFallback();
      return;
    }

    /*
     * Mise à jour du contenu existant
     * sans remplacer l'objet window.DATA.
     * Cela permet à app.js de conserver
     * correctement ses références.
     */
    requiredSections.forEach(section => {
      const target = fallbackData[section];
      const source = remoteData[section];

      if (
        Array.isArray(target) &&
        Array.isArray(source)
      ) {
        target.splice(
          0,
          target.length,
          ...source
        );

      } else if (
        target &&
        typeof target === "object" &&
        !Array.isArray(target) &&
        source &&
        typeof source === "object" &&
        !Array.isArray(source)
      ) {
        Object.keys(target).forEach(
          key => delete target[key]
        );

        Object.assign(
          target,
          source
        );
      }
    });

    window.DATA = fallbackData;

    console.log(
      "✅ Contenu chargé depuis Supabase."
    );

    window.dispatchEvent(
      new Event("content-ready")
    );

  } catch (error) {

    console.error(
      "Erreur lors du chargement Supabase :",
      error
    );

    useFallback();
  }
})();
