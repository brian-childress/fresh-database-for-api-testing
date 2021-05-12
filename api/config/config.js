module.exports = {
  PORT: 8080,
  RATE_LIMIT_DURATION: 1,
  RATE_LIMIT_POINTS: 50,
  JWT_PAYLOAD_COOKIE_KEY: "_p",
  JWT_SIGNATURE_COOKIE_KEY: "_s",
  JWT_PAYLOAD_COOKIE_OPTIONS: {
    // maxAge: 1000 * 60 * 30, // expires after 30 minutes
    sameSite: "lax",
    // secure: true // TODO: Set to true when not on localhost
  },
  JWT_SIGNATURE_COOKIE_OPTIONS: {
    httpOnly: true, // The cookie only accessible by the web server
    sameSite: "lax",
    // secure: true // TODO: Set to true when not on localhost
  },
  REDIRECT_STATE_COOKIE_KEY: "state",
  AUTH: {
    GOOGLE: {
      AUTH_URL: "https://accounts.google.com/o/oauth2/v2/auth",
      ACCESS_TYPE: "offline",
      REDIRECT_URI: "http://localhost:8080/auth/google/callback",
      SCOPE: "openid email profile",
      TOKEN_URL: "https://oauth2.googleapis.com/token",
      USERINFO_URL: "https://openidconnect.googleapis.com/v1/userinfo",
    },
  },
};
