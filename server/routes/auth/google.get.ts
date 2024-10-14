import pool from "~/server/db";

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    const {
      email,
      given_name: firstName,
      family_name: lastName,
      picture: profileImage,
      sub: googleId,
    } = user;

    // Retrieve the redirectUrl from cookies
    const cookies = event.req.headers.cookie;
    const redirectUrl = cookies
      ? cookies
          .split("; ")
          .find((row) => row.startsWith("redirectUrl="))
          ?.split("=")[1] || "/"
      : "/";

    // Check if the user exists in the database
    let existingUser = await pool.query(
      'SELECT * FROM "nc_pka4___Utilizatori" WHERE "Google_id" = $1 OR "Email" = $2',
      [googleId, email]
    );

    if (existingUser.rows.length === 0) {
      const newUser = await pool.query(
        `INSERT INTO "nc_pka4___Utilizatori" ("Nume", "Prenume", "Email", "Google_id", "Provider", "Is_verified", "Profile_Image")
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [firstName, lastName, email, googleId, "google", true, profileImage]
      );
      existingUser = { rows: [newUser.rows[0]] };
    }

    // Set the user session after successful login
    await setUserSession(event, {
      user: {
        id: existingUser.rows[0].id,
        googleId: existingUser.rows[0].Google_id,
        email: existingUser.rows[0].Email,
        provider: "google",
      },
      loggedInAt: new Date(),
    });

    // Redirect back to the stored URL or homepage
    return sendRedirect(event, decodeURIComponent(redirectUrl));
  },

  onError(event, error) {
    console.error("Google OAuth error:", error);

    const cookies = event.req.headers.cookie;
    const redirectUrl = cookies
      ? cookies
          .split("; ")
          .find((row) => row.startsWith("redirectUrl="))
          ?.split("=")[1] || "/"
      : "/";

    return sendRedirect(
      event,
      `${decodeURIComponent(
        redirectUrl
      )}?error=Google OAuth failed. Please try again.`
    );
  },
});
