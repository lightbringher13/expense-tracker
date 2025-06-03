// src/auth/publicRoutes.js
export const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/magic-link",          // request page
  "/magic-link/confirm",  // confirmation page
  "/forgot-password",
  "/reset-password",
];

// A helper that returns true if the current pathname is “public”
export function isPublicPath(pathname) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}