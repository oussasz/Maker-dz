import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/SimpleUser.js";
import jwt from "jsonwebtoken";

// Configure Google OAuth Strategy
const getCallbackUrl = () => {
  let url = process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback";
  if (!url.endsWith("/callback")) {
    url += "/callback";
  }
  return url;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: getCallbackUrl(),
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists, update Google ID if not set
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user from Google profile
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          username:
            profile.displayName || profile.emails[0].value.split("@")[0],
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          profilePicture: profile.photos?.[0]?.value || "",
          role: "buyer", // Default role
          isEmailVerified: true, // Google emails are verified
          authProvider: "google",
        });

        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

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
