// src/api/axiosClient.js
import axios from 'axios';
import { refreshAccessToken } from './auth';

/**
 * 1) Create an Axios instance that automatically sends any HttpOnly cookies
 *    (e.g. your “refreshToken” cookie) on each request to “/api”.
 */
const axiosClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

/**
 * 2) In a request interceptor, read whatever “accessToken” is in localStorage,
 *    and attach it as a Bearer header.  We do *not* attempt to decode/refresh here;
 *    we’ll allow the server → respond with 401/403 and handle that in the
 *    response interceptor below.
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ——————————————————————————————
 * 3) RESPONSE INTERCEPTOR: catch 401/403 → do a single “/auth/refresh” → retry all failed requests
 * ——————————————————————————————
 *
 * If multiple API calls fire off in quick succession and all get a 401/403 at the same time,
 * we don’t want to launch N separate “/auth/refresh” calls.  Instead, we:
 *
 *   (a) keep a single `refreshPromise` in flight,
 *   (b) collect any other requests that also fail into a `subscribers[]` queue,
 *   (c) once the first refresh succeeds and we have a brand-new access token, we re-run every
 *       queued request with the new token.
 *
 * (This “queue + single-promise” pattern ensures you only ever run one real refresh-endpoint
 *  call, even if 5 separate requests all saw 401 at essentially the same moment.)
 */

let isRefreshing   = false;
let refreshPromise = null;
let subscribers    = [];

/**
 *  Called once the in-flight `refreshPromise` resolves.
 *  We invoke every queued callback, passing along the new access token.
 */
function onAccessTokenFetched(newAccessToken) {
  subscribers.forEach((callback) => callback(newAccessToken));
  subscribers = [];
}

/**
 *  Add one more callback into the `subscribers` queue.  As soon as the single
 *  `refreshPromise` resolves, that callback will run with the fresh token.
 */
function addSubscriber(callback) {
  subscribers.push(callback);
}

axiosClient.interceptors.response.use(
  (response) => {
    // If the response is 2xx, just return it immediately.
    return response;
  },
  (error) => {
    const { config: originalRequest, response } = error;

    // Only trigger a “refresh + retry” if:
    //   1) server actually replied (response is defined), AND
    //   2) status is 401 or 403, AND
    //   3) we have not already retried this request (_retry flag), AND
    //   4) this request is not itself “/auth/refresh” (to avoid infinite loops).
    if (
      response &&
      (response.status === 401 || response.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith('/auth/refresh')
    ) {
      originalRequest._retry = true;

      // If no refresh is in flight, start one now:
      if (!isRefreshing) {
        // ← Flip the flag *synchronously* so no other request can slip in here:
        isRefreshing = true;

        refreshPromise = refreshAccessToken()
          .then((newAccessToken) => {
            // Depending on your backend’s JSON shape, adjust this destructuring:
            // • If your server returns { token: "..." } → use { token: newAccessToken }
            // • If it returns { accessToken: "..." } → use { accessToken: newAccessToken }
            //
            // In this example, we assume “/auth/refresh” returns { token: "..." }.
            // 1) Store the new access token so future requests pick it up:
            localStorage.setItem('accessToken', newAccessToken);

            // 2) Let every queued request know the new token is ready:
            onAccessTokenFetched(newAccessToken);

            return newAccessToken;
          })
          .catch((refreshErr) => {
            // If “/auth/refresh” itself fails (e.g. the refresh cookie is expired):
            localStorage.removeItem('accessToken');
            throw refreshErr;
          })
          .finally(() => {
            isRefreshing   = false;
            refreshPromise = null;
          });
      }

      // Return a Promise that “pauses” until the single `refreshPromise` resolves (or rejects).
      return new Promise((resolve, reject) => {
        // As soon as `refreshPromise` resolves, we get a `newAccessToken` and:
        //  • update this original request’s Authorization header
        //  • retry the original request
        addSubscriber((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(axiosClient(originalRequest));
        });

        // If the `refreshPromise` rejects, propagate that failure to this waiting request:
        if (refreshPromise) {
          refreshPromise.catch((err) => {
            reject(err);
          });
        }
      });
    }

    // For any other kind of failure (or if _retry is already true), just bubble the error:
    return Promise.reject(error);
  }
);

export default axiosClient;