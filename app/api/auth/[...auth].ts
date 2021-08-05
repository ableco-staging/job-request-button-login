import { passportAuth } from "blitz";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import createOrUpdateUser from "app/auth/services/createOrUpdateUser";

export default passportAuth({
  successRedirectUrl: "/",
  errorRedirectUrl: "/",
  strategies: [
    {
      authenticateOptions: { scope: "email profile" },
      strategy: new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          const email = profile.emails ? profile.emails[0]?.value : null;

          if (!email) {
            return done(new Error("Google OAuth response doesn't have email."));
          }

          const user = await createOrUpdateUser({
            email,
            name: profile.displayName,
            picture: profile._json.picture as string,
          });

          done(null, {
            publicData: {
              userId: user.id,
              roles: [user.role],
              source: "google",
            },
          });
        },
      ),
    },
  ],
});
