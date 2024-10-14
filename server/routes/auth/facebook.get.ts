import pool from "~/server/db";

export default defineOAuthFacebookEventHandler({
  async onSuccess(event, { user }) {
    const {
      email,
      first_name: firstName,
      last_name: lastName,
      id: facebookId,
      picture,
    } = user;

    const profileImage = picture?.data?.url || null;

    // Retrieve the redirectUrl from cookies
    const cookies = event.req.headers.cookie;
    const redirectUrl = cookies
      ? cookies
          .split("; ")
          .find((row) => row.startsWith("redirectUrl="))
          ?.split("=")[1] || "/"
      : "/";

    // Check if the user exists in the database by Facebook ID or Email
    let existingUser = await pool.query(
      'SELECT * FROM "nc_pka4___Utilizatori" WHERE "Facebook_id" = $1 OR "Email" = $2',
      [facebookId, email]
    );

    if (existingUser.rows.length === 0) {
      // Create a new user if they do not exist
      const newUser = await pool.query(
        `INSERT INTO "nc_pka4___Utilizatori" ("Nume", "Prenume", "Email", "Facebook_id", "Provider", "Is_verified", "Profile_Image")
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [firstName, lastName, email, facebookId, "facebook", true, profileImage]
      );
      existingUser = { rows: [newUser.rows[0]] };
    }

    // Set the user session after successful login
    await setUserSession(event, {
      user: {
        id: existingUser.rows[0].id,
        facebookId: existingUser.rows[0].Facebook_id,
        email: existingUser.rows[0].Email,
        provider: "facebook",
      },
      loggedInAt: new Date(),
    });

    // Redirect back to the stored URL or homepage
    return sendRedirect(event, decodeURIComponent(redirectUrl));
  },

  onError(event, error) {
    console.error("Facebook OAuth error:", error);

    // Retrieve the redirectUrl from cookies
    const cookies = event.req.headers.cookie;
    const redirectUrl = cookies
      ? cookies
          .split("; ")
          .find((row) => row.startsWith("redirectUrl="))
          ?.split("=")[1] || "/"
      : "/";

    // Return an error message and redirect back
    return sendRedirect(
      event,
      `${decodeURIComponent(
        redirectUrl
      )}?error=Facebook OAuth failed. Please try again.`
    );
  },
});
