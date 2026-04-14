import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";

// ─── Token Management ────────────────────────────────────────────────
export const storeToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error("[LocalStorage] Failed to store token:", error);
  }
};

export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("[LocalStorage] Failed to get token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("[LocalStorage] Failed to remove token:", error);
  }
};

// ─── Refresh Token Management ─────────────────────────────────────────

export const storeRefreshToken = async (token) => {
  try {
    if(token) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error("[LocalStorage] Failed to store refresh token:", error);
  }
};

export const getRefreshToken = async () => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("[LocalStorage] Failed to get refresh token:", error);
    return null;
  }
};

export const removeRefreshToken = async () => {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("[LocalStorage] Failed to remove refresh token:", error);
  }
};

// ─── User Data Management ────────────────────────────────────────────
export const storeUser = async (user) => {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("[LocalStorage] Failed to store user:", error);
  }
};

export const getUser = async () => {
  try {
    const data = await SecureStore.getItemAsync(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("[LocalStorage] Failed to get user:", error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    console.error("[LocalStorage] Failed to remove user:", error);
  }
};

// ─── Full Session Clear ──────────────────────────────────────────────
export const clearAuthStorage = async () => {
  try {
    await Promise.all([
      removeToken(),
      removeRefreshToken(),
      removeUser()
    ]);
  } catch (error) {
    console.error("[LocalStorage] Failed to clear auth storage:", error);
  }
};