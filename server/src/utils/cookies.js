const isProd = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure:
    process.env.COOKIE_SECURE != null
      ? process.env.COOKIE_SECURE === "1"
      : isProd,
  sameSite: (process.env.COOKIE_SAMESITE || "lax").toLowerCase(),
  path: "/", // important for set + clear consistency
  // recommended:
  // maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Safety guard
if (cookieOptions.sameSite === "none" && !cookieOptions.secure) {
  throw new Error("Cookie config invalid: SameSite=None requires Secure=true");
}
