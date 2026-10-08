(async () => {
  try {
    const { data, error } = await window.supabaseClient
      .from("site_content")
      .select("section")
      .limit(1);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return;
    }

    console.log("SUPABASE CONNECTED:", data);
  } catch (err) {
    console.error("CONNECTION ERROR:", err);
  }
})();
