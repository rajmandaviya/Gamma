import pool from "../db";

export default defineEventHandler(async (event) => {
  const baseUrl = process.env.NUXT_BASE_URL;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM public."nc_pka4___SubCategorii" WHERE "Top_Categorii" = TRUE'
    );

    const topCategories = rows.map((topCategory) => {
      const images = JSON.parse(topCategory.Images);
      const imagePath = images[0]?.path || "";

      return {
        id: topCategory.id,
        nameRo: topCategory.Nume_SubCategorie_RO,
        nameRu: topCategory.Nume__SubCategorie_RU,
        imagePath: `${baseUrl}/${imagePath}`,
      };
    });

    return {
      success: true,
      categories: topCategories,
    };
  } catch (error) {
    console.error("Database query error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch topCategories",
    };
  }
});
