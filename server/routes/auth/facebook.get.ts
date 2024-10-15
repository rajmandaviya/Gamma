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

    let existingUser = await pool.query(
      'SELECT * FROM "nc_pka4___Utilizatori" WHERE "Email" = $1',
      [email]
    );

    if (
      existingUser.rows.length > 0 &&
      existingUser.rows[0].Provider !== "facebook"
    ) {
      event.res.writeHead(200, { "Content-Type": "text/html" });
      event.res.end(
        `<script>window.opener.postMessage({ status: "error", message: "auth.email_already_registered_with_other_provider" }, "*"); window.close();</script>`
      );
      return;
    }

    if (existingUser.rows.length === 0) {
      const newUser = await pool.query(
        `INSERT INTO "nc_pka4___Utilizatori" ("Nume", "Prenume", "Email", "Facebook_id", "Provider", "Is_verified", "Profile_Image")
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [firstName, lastName, email, facebookId, "facebook", true, profileImage]
      );
      existingUser = { rows: [newUser.rows[0]] };
    }

    await setUserSession(event, {
      user: {
        id: existingUser.rows[0].id,
        facebookId: existingUser.rows[0].Facebook_id,
        email: existingUser.rows[0].Email,
        firstName: existingUser.rows[0].Nume,
        lastName: existingUser.rows[0].Prenume,
        provider: "facebook",
      },
      loggedInAt: new Date(),
    });

    event.res.writeHead(200, { "Content-Type": "text/html" });
    event.res.end(
      `<script>window.opener.postMessage({ status: "success", message: "auth.facebook_login_successful" }, "*"); window.close();</script>`
    );
  },

  onError(event, error) {
    event.res.writeHead(200, { "Content-Type": "text/html" });
    event.res.end(
      `<script>window.opener.postMessage({ status: "error", message: "auth.facebook_login_failed" }, "*"); window.close();</script>`
    );
  },
});
