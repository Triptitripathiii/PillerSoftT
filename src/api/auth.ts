// src/api/auth.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE = 'http://testlink4.pillersofttechnologies.com/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Optional: attach token automatically if saved
api.interceptors.request.use(async (cfg) => {
  try {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      cfg.headers = cfg.headers ?? {};
      cfg.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return cfg;
}, (err) => Promise.reject(err));

/**
 * Register user
 * @param data { first_name, last_name, email, password, mobile_number }
 */
export async function register(data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mobile_number: string;
}) {
  const resp = await api.post('/register', data);
  console.log('Register response', resp.data);
  return resp.data;
}

/**
 * Login user
 * @param data { email, password, remember_me? }
 */
export async function login(data: { email: string; password: string; remember_me?: boolean }) {
  const resp = await api.post('/login', data);
  console.log('Login response', resp.data);
  // optionally store token here
  if (resp?.data?.data?.token) {
    await AsyncStorage.setItem('@auth_token', resp.data.data.token);
  }
  return resp.data;
}

/**
 * Get current user (protected)
 */
export async function getUser() {
  const resp = await api.get('/user');
  return resp.data;
}

/**
 * Logout helper (delete token)
 */
export async function logout() {
  await AsyncStorage.removeItem('@auth_token');
}
