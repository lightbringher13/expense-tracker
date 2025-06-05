/**
 * POST /api/auth/magic-link
 *   body: { email: "foo@bar.com" }
 *   returns: 204 No Content
 */
export async function sendMagicLink({ email }) {
  const res = await fetch("/api/auth/magic-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`sendMagicLink failed: ${res.status} ${text}`);
  }
}

/**
 * GET /api/auth/magic-link/confirm?token=…
 *   ↳ Backend responds with   { token: "newAccessJwt" }
 *   and also sets HttpOnly refresh cookie on the response.
 *
 *   We do `credentials: "include"` so the browser will accept/set that cookie.
 */
export async function confirmMagicLink(token) {
  const resp = await fetch(
    `/api/auth/magic-link/confirm?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
      credentials: "include", 
    }
  );

  if (resp.ok) {
    // 200 → JSON { token: "someAccessJwt" }
    const { token: accessJwt } = await resp.json();
    return accessJwt;
  }

  // non‐2xx → the body is something like { error: "TOKEN_EXPIRED", message: "..." }
  let body;
  try {
    body = await resp.json();
  } catch {
    throw new Error("UNKNOWN_ERROR");
  }
  if (body && body.error) {
    throw new Error(body.error);
  }
  throw new Error("UNKNOWN_ERROR");
}

/**
 * POST /api/auth/refresh
 *   ↳ This endpoint *only* relies on the HttpOnly refresh cookie the server set earlier.
 *   Backend responds with { token: "newAccessJwt" } and also rotates the refresh‐cookie.
 *
 *   We do `credentials: "include"` so that the browser sends the cookie along automatically.
 */
export async function refreshAccessToken() {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`refreshAccessToken failed: ${res.status}`);
  }
  const { token: newAccessJwt } = await res.json();
  return newAccessJwt;
}

/**
 * POST /api/auth/logout
 *   ↳ Server will revoke the current refresh‐token (if any),
 *     and send back Set‐Cookie: refreshToken=; Max‐Age=0; Path=/;SameSite=None;Secure
 *   We include credentials so the cookie gets cleared.
 */
export async function logout() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`logout failed: ${res.status}`);
  }
}