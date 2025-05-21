import axiosClient from './axiosClient';

export function register({ fullName, email, password }) {
  return axiosClient.post('/auth/register', {
    fullName,
    email,
    password,
  });
}

export function login({ email, password }) {
  return axiosClient.post('/auth/login', { email, password })
    .then(res => res.data.token);    // assuming your back end returns { token: "…" }
}

export function verifyEmail(token) {
  return axiosClient.get(`/auth/verify?token=${token}`);
}