// src/api/auth.js

/**
 * sendMagicLink({ email })
 *   └── POST /api/auth/magic-link
 *   └── returns nothing (204 Accepted)
 */
export async function sendMagicLink({ email }) {
  const res = await fetch('/api/auth/magic-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`sendMagicLink failed: ${res.status} ${text}`);
  }
}

/**
 * confirmMagicLink(token)
 *   └── GET /api/auth/magic-link/confirm?token=...
 *   └── returns { token: accessJwtString } in JSON
 */
// src/api/auth.js
export async function confirmMagicLink(token) {
  const resp = await fetch(
    `/api/auth/magic-link/confirm?token=${encodeURIComponent(token)}`, 
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (resp.ok) {
    // 200 → { accessToken: "..." }
    const { accessToken } = await resp.json();
    return accessToken;
  }

  // non-2xx: read the JSON body, which looks like:
  //   { error: "INVALID_TOKEN", message: "Token is invalid or does not exist" }
  let body;
  try { body = await resp.json(); }
  catch (_) { 
    throw new Error("UNKNOWN_ERROR"); 
  }

  // Throw an Error whose message is exactly the `error` code from the server.
  // (You could also include body.message in there, but we only need a short string
  // to switch on in the React component.)
  if (body && body.error) {
    throw new Error(body.error);
  }

  throw new Error("UNKNOWN_ERROR");
}

/**
 * refreshAccessToken()
 *   └── POST /api/auth/refresh
 *   └── returns { token: newAccessJwt } in JSON
 *   └── rely on HttpOnly "refreshToken" cookie
 */
export async function refreshAccessToken() {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include', // ensure cookies (refreshToken) are sent
  });
  if (!res.ok) {
    throw new Error(`refreshAccessToken failed: ${res.status}`);
  }
  const { token: newAccessJwt } = await res.json();
  return newAccessJwt;
}

/**
 * logout()
 *   └── POST /api/auth/logout
 *   └── clears the refresh‐token cookie on server + client
 */
export async function logout() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`logout failed: ${res.status}`);
  }
}