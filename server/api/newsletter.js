import pool from "~/server/db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const email = body.email;

    if (!email) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    const query = `
      INSERT INTO public."nc_ssxn___Emailuri" ("Emailuri")
      VALUES ($1);
    `;
    await pool.query(query, [email]);

    return {
      success: true,
      message: "Email added successfully",
    };
  } catch (error) {
    console.error("Error adding email:", error.message);
    console.error("Full error details:", error.stack);

    return {
      success: false,
      error: error.message || "Failed to add email",
    };
  }
});
