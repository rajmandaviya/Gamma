import pool from "../db";

export default defineEventHandler(async (event) => {
  const baseUrl = process.env.NUXT_BASE_URL;

  try {
    const { rows } = await pool.query(
      `SELECT 
        sub.*,
        cat.id as cat_id,
        cat."Nume_Categorie_RO" as cat_name_ro,
        cat."Nume_Categorie_RU" as cat_name_ru
      FROM public."nc_pka4___SubCategorii" sub
      LEFT JOIN public."nc_pka4___Categorii" cat
      ON sub."nc_pka4___Categorii_id" = cat.id
      WHERE sub."Top_Categorii" = TRUE`
    );

    const topCategories = rows.map((row) => {
      const images = JSON.parse(row.Images);
      const imagePath = images[0]?.path || "";

      return {
        id: row.id,
        nameRo: row.Nume_SubCategorie_RO,
        nameRu: row.Nume__SubCategorie_RU,
        imagePath: `${baseUrl}/${imagePath}`,
        mainCategory: row.cat_id
          ? {
              id: row.cat_id,
              nameRo: row.cat_name_ro,
              nameRu: row.cat_name_ru,
            }
          : null,
      };
    });

    return {
      success: true,
      categories: topCategories,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch topCategories",
    };
  }
});
