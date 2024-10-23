import pool from "~/server/db";

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);

    if (!session || !session.user) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized: No valid session found",
      });
    }

    const userId = session.user.id;

    const result = await pool.query(
      `SELECT "Nume", "Prenume", "Email", "Numar_Telefon", "Provider" FROM "nc_pka4___Utilizatori" WHERE "id" = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    return {
      Nume: user.Nume,
      Prenume: user.Prenume,
      Email: user.Email,
      Numar_Telefon: user.Numar_Telefon,
      Provider: user.Provider,
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error fetching user profile",
    });
  }
});
