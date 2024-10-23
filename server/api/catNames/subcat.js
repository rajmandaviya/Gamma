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
      SELECT "Nume_SubCategorie_RO", "Nume__SubCategorie_RU"
      FROM public."nc_pka4___SubCategorii"
      WHERE id = $1
    `;
    const values = [id];

    console.log("Executing query:", sqlQuery);
    console.log("With values:", values);

    const result = await pool.query(sqlQuery, values);

    console.log("Query result:", result.rows);

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Subcategory not found",
      });
    }

    return {
      Nume_SubCategorie_RO: result.rows[0].Nume_SubCategorie_RO,
      Nume_SubCategorie_RU: result.rows[0].Nume__SubCategorie_RU, // Note the double underscore
    };
  } catch (error) {
    console.error("Error fetching subcategory names:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: { errorMessage: error.message, errorCode: error.code },
    });
  }
});
