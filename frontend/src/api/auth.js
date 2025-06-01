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
export async function confirmMagicLink(token) {
  const res = await fetch(`/api/auth/magic-link/confirm?token=${token}`, {
    method: 'GET',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`confirmMagicLink failed: ${res.status} ${text}`);
  }
  const { token: accessJwt } = await res.json();
  return accessJwt;
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