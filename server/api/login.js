import pool from "~/server/db"; // PostgreSQL connection

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Read the request body
  const { email, password } = body;

  // Check if the user exists by email
  const userResult = await pool.query(
    'SELECT * FROM "nc_pka4___Utilizatori" WHERE "Email" = $1',
    [email]
  );

  if (userResult.rows.length === 0) {
    throw createError({
      statusCode: 400,
      message: "User not found",
    });
  }

  const user = userResult.rows[0];

  // Verify the password using Nuxt Auth Utils
  const validPassword = await verifyPassword(user.password, password);

  if (!validPassword) {
    throw createError({
      statusCode: 401,
      message: "Invalid password",
    });
  }

  // Set the user session after successful login
  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      provider: "email",
    },
    loggedInAt: new Date(),
  });

  return {
    statusCode: 200,
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      provider: "email",
    },
  };
});
