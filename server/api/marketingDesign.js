import pool from "~/server/db";

let marketingCache = {
  data: null,
  cacheTime: 0,
};

const cacheDuration = 3600 * 1000;

export default defineEventHandler(async (event) => {
  const NUXT_BASE_URL = process.env.NUXT_BASE_URL || "http://localhost";
  const currentTime = Date.now();

  try {
    if (
      marketingCache.data &&
      currentTime - marketingCache.cacheTime < cacheDuration
    ) {
      return { success: true, data: marketingCache.data };
    }

    const query = `
      SELECT *
      FROM public."nc_ssxn___Marketing-Design"
      ORDER BY id ASC;
    `;

    const res = await pool.query(query);

    const processedData = res.rows.map((row) => {
      const extractFullUrls = (items) => {
        if (!items) return [];
        return items.map((item) => `${NUXT_BASE_URL}/${item.path}`);
      };

      return {
        id: row.id,
        Logo: extractFullUrls(JSON.parse(row.Logo)),
        Bannere_Slider_RO_: extractFullUrls(JSON.parse(row.Bannere_Slider_RO_)),
        Bannere_Slider_RU_: extractFullUrls(JSON.parse(row.Bannere_Slider_RU_)),
        Logo_Black: extractFullUrls(JSON.parse(row.Logo_Black)),
        Banner1_RO_: extractFullUrls(JSON.parse(row.Banner1_RO_)),
        Banner2_RO_: extractFullUrls(JSON.parse(row.Banner2_RO_)),
        Banner3_RO_: extractFullUrls(JSON.parse(row.Banner3_RO_)),
        Banner1_RU_: extractFullUrls(JSON.parse(row.Banner1_RU_)),
        Banner2_RU_: extractFullUrls(JSON.parse(row.Banner2_RU_)),
        Banner3_RU_: extractFullUrls(JSON.parse(row.Banner3_RU_)),
      };
    });

    marketingCache.data = processedData;
    marketingCache.cacheTime = currentTime;

    return { success: true, data: processedData };
  } catch (error) {
    console.error("Error fetching marketing design data:", error.message);
    console.error("Full error details:", error.stack);

    return {
      success: false,
      error: error.message || "Failed to fetch marketing design data",
    };
  }
});
