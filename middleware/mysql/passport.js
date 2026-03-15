import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../../models/mysql/index.js";

// Configure Google OAuth Strategy
const getCallbackUrl = () => {
  let url = process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback";
  if (!url.endsWith("/callback")) {
    url += "/callback";
  }
  return url;
};

const hasGoogleOAuth =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

if (hasGoogleOAuth) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: getCallbackUrl(),
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;

          // Check if user already exists by email
          let user = await User.findByEmail(email);

          if (user) {
            // User exists — link Google ID if not set
            if (!user.google_id) {
              await User.updateById(user.id, { google_id: profile.id });
              user.google_id = profile.id;
            }
            return done(null, user);
          }

          // Check if user exists by Google ID
          user = await User.findByGoogleId(profile.id);
          if (user) {
            return done(null, user);
          }

          // New user — do NOT create yet. Return profile data so the
          // callback handler can redirect to the role-selection page.
          return done(null, {
            isNewGoogleUser: true,
            googleId: profile.id,
            email,
            username: profile.displayName || email.split("@")[0],
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            avatar: profile.photos?.[0]?.value || "",
          });
        } catch (error) {
          console.error("Google OAuth error:", error);
          return done(error, null);
        }
      },
    ),
  );
} else {
  console.warn(
    "⚠️ Google OAuth not configured: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET",
  );
}

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
