// server/api/subcategories.js
import client from "~/server/db"; // Import the connected db client

// In-memory cache object for subcategories
let cache = {
  subcategories: {}, // Cache for each category's subcategories
  cacheTime: 0, // Timestamp to track when the cache was last set
};

const cacheDuration = 3600 * 1000; // Cache duration in milliseconds (1 hour)

export default defineEventHandler(async (event) => {
  const { categoryId } = getQuery(event); // Extract categoryId from the query parameters
  const currentTime = Date.now();

  if (!categoryId) {
    return {
      success: false,
      error: "Category ID is required",
    };
  }

  try {
    // Check if data for this category is cached and still valid
    if (
      cache.subcategories[categoryId] &&
      currentTime - cache.cacheTime < cacheDuration
    ) {
      // If cached data exists and is still valid, return it
      return { success: true, data: cache.subcategories[categoryId] };
    }

    // Query to get subcategories based on categoryId, selecting only needed fields
    const subcategoriesQuery = `
      SELECT id, "Nume_SubCategorie_RO", "Nume__SubCategorie_RU", "nc_pka4___Categorii_id"
      FROM public."nc_pka4___SubCategorii"
      WHERE "nc_pka4___Categorii_id" = $1
      ORDER BY id ASC;
    `;

    const subcategoriesRes = await client.query(subcategoriesQuery, [
      categoryId,
    ]);
    const subcategories = subcategoriesRes.rows;

    // Fetch sub-subcategories for each subcategory, selecting only needed fields
    const subcategoryIds = subcategories.map((sub) => sub.id);

    const subSubcategoriesQuery = `
      SELECT id, "Nume_SubSubCategorie_RO", "Nume_SubSubCategorie_RU", "nc_pka4___SubCategorii_id"
      FROM public."nc_pka4___SubSubCategorii"
      WHERE "nc_pka4___SubCategorii_id" = ANY($1::int[])
      ORDER BY id ASC;
    `;

    const subSubcategoriesRes = await client.query(subSubcategoriesQuery, [
      subcategoryIds,
    ]);
    const subSubcategories = subSubcategoriesRes.rows;

    // Organize sub-subcategories by subcategory
    const formattedData = subcategories.map((subcategory) => {
      const filteredSubSubcategories = subSubcategories.filter(
        (subSub) => subSub.nc_pka4___SubCategorii_id === subcategory.id
      );

      return {
        id: subcategory.id,
        subcategory_name_ro: subcategory.Nume_SubCategorie_RO,
        subcategory_name_ru: subcategory.Nume__SubCategorie_RU,
        subSubcategories: filteredSubSubcategories.map((subSub) => ({
          id: subSub.id,
          subsub_name_ro: subSub.Nume_SubSubCategorie_RO,
          subsub_name_ru: subSub.Nume_SubSubCategorie_RU,
        })),
      };
    });

    // Cache the result for this category and set the cache time
    cache.subcategories[categoryId] = formattedData;
    cache.cacheTime = currentTime;

    // Return the formatted data
    return { success: true, data: formattedData };
  } catch (error) {
    console.error(
      "Error fetching subcategories and sub-subcategories:",
      error.message
    );
    console.error("Full error details:", error.stack);

    // Return the error message in the response to help debug
    return {
      success: false,
      error:
        error.message || "Failed to fetch subcategories and sub-subcategories",
    };
  }
});
