import pool from "../../db";
import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing id parameter",
    });
  }

  try {
    const sqlQuery = `
      SELECT "Nume_SubSubCategorie_RO", "Nume_SubSubCategorie_RU"
      FROM public."nc_pka4___SubSubCategorii"
      WHERE id = $1
    `;
    const values = [id];

    const result = await pool.query(sqlQuery, values);

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "SubSubcategory not found",
      });
    }

    // Return only the specified fields
    return {
      Nume_SubSubCategorie_RO: result.rows[0].Nume_SubSubCategorie_RO,
      Nume_SubSubCategorie_RU: result.rows[0].Nume_SubSubCategorie_RU,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: { errorMessage: error.message, errorCode: error.code },
    });
  }
});
