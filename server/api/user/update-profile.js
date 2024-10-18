import pool from "~/server/db";
import bcrypt from "bcrypt";

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
    const body = await readBody(event);

    const { Nume, Prenume, Numar_Telefon, Email, Password, Provider } = body;

    let queryParams = [Nume, Prenume, Numar_Telefon, userId];
    let query = `
      UPDATE "nc_pka4___Utilizatori"
      SET "Nume" = $1, "Prenume" = $2, "Numar_Telefon" = $3
    `;

    if (Provider !== "google" && Provider !== "facebook") {
      query += `, "Email" = $${queryParams.length + 1}`;
      queryParams.push(Email);
    }

    if (Password && Provider === "email") {
      const hashedPassword = await bcrypt.hash(Password, 10);
      query += `, "Password" = $${queryParams.length + 1}`;
      queryParams.push(hashedPassword);
    }

    query += ` WHERE "id" = $4 RETURNING *`;

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    const updatedUser = result.rows[0];
    return {
      message: "Profile updated successfully",
      user: {
        Nume: updatedUser.Nume,
        Prenume: updatedUser.Prenume,
        Email: updatedUser.Email,
        Numar_Telefon: updatedUser.Numar_Telefon,
        Provider: updatedUser.Provider,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: "Error updating user profile: " + error.message,
    });
  }
});
