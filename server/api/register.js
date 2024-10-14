import { sendError, createError, defineEventHandler, readBody } from "h3";
import pool from "~/server/db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password, fullName } = body;

    // Validate inputs
    if (!email || !password || !fullName) {
      throw createError({
        statusCode: 400,
        message: "All fields are required.",
      });
    }

    // Check for existing user
    let existingUser = await pool.query(
      'SELECT * FROM "nc_pka4___Utilizatori" WHERE "Email" = $1',
      [email]
    );

    // If user exists, return an error
    if (existingUser.rows.length > 0) {
      throw createError({
        statusCode: 400,
        message: "Email is already registered.",
      });
    }

    // Insert new user
    await pool.query(
      `INSERT INTO "nc_pka4___Utilizatori" ("Nume", "Prenume", "Email", "Password", "Provider", "Is_verified")
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        fullName.split(" ")[0], // Nume (first part of full name)
        fullName.split(" ").slice(1).join(" "), // Prenume (rest of the full name)
        email,
        password, // Note: Consider hashing the password in production
        "email", // Provider is "email"
        false, // Is_verified is false initially
      ]
    );

    // Return success response
    return {
      statusCode: 200,
      message: "User registered successfully",
    };
  } catch (error) {
    console.error("Registration error:", error);
    // Use sendError to return error in JSON format
    return sendError(
      event,
      createError({
        statusCode: error.statusCode || 500,
        message: error.message || "Internal Server Error",
      })
    );
  }
});
