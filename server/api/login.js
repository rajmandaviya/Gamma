import { defineEventHandler, createError, readBody } from "h3";
import pool from "~/server/db";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    // Check if the user exists by email
    const userResult = await pool.query(
      'SELECT "id", "Email" AS "email", "Password" AS "password", "Nume" AS "firstName", "Prenume" AS "lastName" FROM "nc_pka4___Utilizatori" WHERE "Email" = $1',
      [email]
    );

    // User not found
    if (userResult.rows.length === 0) {
      throw createError({
        statusCode: 400,
        data: {
          errorCode: "auth.user_not_found",
        },
      });
    }

    const user = userResult.rows[0];

    // Check if password is valid
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw createError({
        statusCode: 401,
        data: {
          errorCode: "auth.invalid_password",
        },
      });
    }

    // Set the user session after successful login
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        provider: "email",
        firstName: user.firstName,
        lastName: user.lastName,
      },
      loggedInAt: new Date(),
    });

    // Success response
    return {
      statusCode: 200,
      message: "auth.login_successful",
      user: {
        id: user.id,
        email: user.email,
        provider: "email",
      },
    };
  } catch (error) {
    console.error("Login error:", error);

    // Send error with errorCode
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
