import { sendError, createError, defineEventHandler, readBody } from "h3";
import pool from "~/server/db";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password, fullName } = body;

    // Validate inputs
    if (!email || !password || !fullName) {
      throw createError({
        statusCode: 400,
        data: {
          errorCode: "auth.missing_fields",
        },
      });
    }

    // Check if the email is already registered
    const existingUserQuery = await pool.query(
      'SELECT * FROM "nc_pka4___Utilizatori" WHERE "Email" = $1',
      [email]
    );

    if (existingUserQuery.rows.length > 0) {
      throw createError({
        statusCode: 400,
        data: {
          errorCode: "auth.email_already_registered",
        },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [firstName, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ") || "Unknown";

    await pool.query(
      `INSERT INTO "nc_pka4___Utilizatori" ("Nume", "Prenume", "Email", "Password", "Provider", "Is_verified")
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [firstName, lastName, email, hashedPassword, "email", false]
    );

    // Return success response
    return {
      statusCode: 200,
      message: "auth.user_registered_successfully",
    };
  } catch (error) {
    console.error("Registration error:", error);

    return sendError(
      event,
      createError({
        statusCode: error.statusCode || 500,
        data: {
          errorCode: error.data?.errorCode || "server.internal_error",
        },
      })
    );
  }
});
