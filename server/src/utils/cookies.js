import config from "../config.js";

export const cookieOptions = {
  httpOnly: true,
  secure: config.COOKIE_SECURE,
  sameSite: config.COOKIE_SAMESITE,
  path: "/",
};

if (cookieOptions.sameSite === "none" && !cookieOptions.secure) {
  throw new Error("Cookie config invalid: SameSite=None requires Secure=true");
}
