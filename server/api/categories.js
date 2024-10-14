import pool from "~/server/db";

let cache = {
  categories: null,
  cacheTime: 0,
};

const cacheDuration = 3600 * 1000;

export default defineEventHandler(async (event) => {
  const currentTime = Date.now();

  try {
    if (cache.categories && currentTime - cache.cacheTime < cacheDuration) {
      return { success: true, data: cache.categories };
    }

    const query = `
      SELECT *
      FROM public."nc_pka4___Categorii"
      ORDER BY id ASC;
    `;

    const res = await pool.query(query);

    cache.categories = res.rows;
    cache.cacheTime = currentTime;

    return { success: true, data: res.rows };
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    console.error("Full error details:", error.stack);

    return {
      success: false,
      error: error.message || "Failed to fetch categories",
    };
  }
});
