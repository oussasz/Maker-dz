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
          // Check if user already exists by email
          let user = await User.findByEmail(profile.emails[0].value);

          if (user) {
            // User exists, update Google ID if not set
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

          // Create new user from Google profile
          const userId = await User.create({
            google_id: profile.id,
            email: profile.emails[0].value,
            username:
              profile.displayName || profile.emails[0].value.split("@")[0],
            first_name: profile.name?.givenName || "",
            last_name: profile.name?.familyName || "",
            profile_picture: profile.photos?.[0]?.value || "",
            role: "customer", // Default role
            is_email_verified: true, // Google emails are verified
            auth_provider: "google",
            password: null, // No password for Google users
          });

          user = await User.findById(userId);
          return done(null, user);
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
