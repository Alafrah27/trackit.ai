import { create } from "zustand";
import { Alert } from "react-native";
import Instance from "../lib/axios";
import {
    storeToken,
    getToken,
    storeRefreshToken,
    removeToken,
    removeRefreshToken,
    storeUser,
    getUser,
    clearAuthStorage,
} from "../utils/LocalStorge";

export const useAuthStore = create((set, get) => ({
    token: null,
    user: null,
    loading: false,
    isInitialized: false,

    // ─── Temporary email cache (used across Register → VerifyOTP flow) ──
    _pendingEmail: null,

    // ─── Hydrate session from local storage on app start ─────────────
    initialize: async () => {
        try {
            const [token, user] = await Promise.all([getToken(), getUser()]);
            if (token && user) {
                // Attach the token to all future requests
                Instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                set({ token, user });
            }
        } catch (error) {
            console.error("[AuthStore] Initialization error:", error);
        } finally {
            set({ isInitialized: true });
        }
    },

    // ─── Fetch Current User Profile ──────────────────────────────────
    getProfile: async () => {
        try {
            const res = await Instance.get("/v1/user/profile");
            const user = res.data.user;
            await storeUser(user);
            set({ user });
            return user;
        } catch (error) {
            console.error("[AuthStore] Profile fetch error:", error);
            // If we get an error here, the axios interceptor already tried to refresh
            // If it failed, the session is definitely dead.
            return null;
        }
    },

    // ─── Register ────────────────────────────────────────────────────
    register: async (name, email, password) => {
        try {
            set({ loading: true });
            const res = await Instance.post("/v1/user/register", {
                name,
                email,
                password,
            });

            if (res.data.success) {
                // Cache the email so the VerifyOTP screen can use it
                set({ _pendingEmail: email });
                return { success: true };
            }

            return { success: false, message: "Registration failed" };
        } catch (error) {
            const message =
                error.response?.data?.message || "Something went wrong. Please try again.";
            Alert.alert("Registration Failed", message);
            return { success: false, message };
        } finally {
            set({ loading: false });
        }
    },

    // ─── Verify OTP ──────────────────────────────────────────────────
    verifyOTP: async (email, otp) => {
        try {
            set({ loading: true });
            const res = await Instance.post("/v1/user/verify-otp", { email, otp });

            const { token, refreshToken, user } = res.data;

            // Persist session securely
            await Promise.all([
                storeToken(token), 
                storeRefreshToken(refreshToken),
                storeUser(user)
            ]);

            // Attach token for all future requests
            Instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            set({ token, user, _pendingEmail: null });
            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message || "Verification failed. Please try again.";
            Alert.alert("Verification Failed", message);
            return { success: false, message };
        } finally {
            set({ loading: false });
        }
    },

    // ─── Resend OTP ──────────────────────────────────────────────────
    resendOTP: async (email) => {
        try {
            set({ loading: true });
            await Instance.post("/v1/user/resend-otp", { email });
            Alert.alert("Code Sent", "A new verification code has been sent to your email.");
            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to resend code. Please try again.";
            Alert.alert("Resend Failed", message);
            return { success: false, message };
        } finally {
            set({ loading: false });
        }
    },

    // ─── Login ───────────────────────────────────────────────────────
    login: async (email, password) => {
        try {
            set({ loading: true });
            const res = await Instance.post("/v1/user/login", { email, password });

            const { token, refreshToken, user } = res.data;

            // Persist session securely
            await Promise.all([
                storeToken(token), 
                storeRefreshToken(refreshToken),
                storeUser(user)
            ]);

            // Attach token for all future requests
            Instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            set({ token, user });
            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message || "Login failed. Please try again.";
            Alert.alert("Login Failed", message);
            return { success: false, message };
        } finally {
            set({ loading: false });
        }
    },

    // ─── Forgot Password ─────────────────────────────────────────────
    forgotPassword: async (email) => {
        try {
            set({ loading: true });
            await Instance.post("/v1/user/forgot-password", { email });
            // Cache email so reset password screen can use it
            set({ _pendingEmail: email });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || "Failed to send reset link.";
            Alert.alert("Request Failed", message);
            return { success: false, message };
        } finally {
            set({ loading: false });
        }
    },

    // ─── Reset Password ──────────────────────────────────────────────
    resetPassword: async (email, otp, newPassword) => {
        try {
            set({ loading: true });
            await Instance.post("/v1/user/reset-password", { email, otp, newPassword });
            set({ _pendingEmail: null });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || "Failed to reset password.";
            Alert.alert("Reset Failed", message);
            return { success: false, message };
        } finally {
            set({ loading: false });
        }
    },

    // ─── Logout ──────────────────────────────────────────────────────
    logout: async () => {
        set({ loading: true });
        try {
            // Attempt to hit server to revoke refresh token
            await Instance.post("/v1/user/logout").catch(() => {});
        } finally {
            // Clear persisted session regardless of server outcome
            await clearAuthStorage();
            delete Instance.defaults.headers.common["Authorization"];
            set({ token: null, user: null, _pendingEmail: null, loading: false });
        }
    },
}));
