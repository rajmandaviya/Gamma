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

    let existingUser = await pool.query(
      'SELECT * FROM "nc_pka4___Utilizatori" WHERE "Email" = $1',
      [email]
    );

    if (
      existingUser.rows.length > 0 &&
      existingUser.rows[0].Provider !== "google"
    ) {
      event.res.writeHead(200, { "Content-Type": "text/html" });
      event.res.end(
        `<script>window.opener.postMessage({ status: "error", message: "auth.email_already_registered_with_other_provider" }, "*"); window.close();</script>`
      );
      return;
    }

    if (existingUser.rows.length === 0) {
      const newUser = await pool.query(
        `INSERT INTO "nc_pka4___Utilizatori" ("Nume", "Prenume", "Email", "Google_id", "Provider", "Is_verified", "Profile_Image")
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [firstName, lastName, email, googleId, "google", true, profileImage]
      );
      existingUser = { rows: [newUser.rows[0]] };
    }

    await setUserSession(event, {
      user: {
        id: existingUser.rows[0].id,
        googleId: existingUser.rows[0].Google_id,
        email: existingUser.rows[0].Email,
        firstName: existingUser.rows[0].Nume, // Assuming "Nume" is the first name
        lastName: existingUser.rows[0].Prenume, // Assuming "Prenume" is the last name
        provider: "google",
        profileImage: existingUser.rows[0].Profile_image,
      },
      loggedInAt: new Date(),
    });

    event.res.writeHead(200, { "Content-Type": "text/html" });
    event.res.end(
      `<script>window.opener.postMessage({ status: "success", message: "auth.google_login_successful" }, "*"); window.close();</script>`
    );
  },

  onError(event, error) {
    event.res.writeHead(200, { "Content-Type": "text/html" });
    event.res.end(
      `<script>window.opener.postMessage({ status: "error", message: "auth.google_login_failed" }, "*"); window.close();</script>`
    );
  },
});
