import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

// Set the base URL for Axios to your deployed backend
axios.defaults.baseURL = 'https://your-backend-deployment-url.vercel.app/api/v1';

export const useAuthStore = create((set) => ({
  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post('/auth/signup', credentials);
      set({ user: response.data.user, isSigningUp: false });
      toast.success("Account created successfully");
      window.location.href = '/';
    } catch (error) {
      toast.error(error.response.data.message || "Signup failed");
      set({ isSigningUp: false, user: null });
    }
  },
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await axios.post('/auth/login', credentials);
      set({ user: response.data.user, isLoggingIn: false });
    } catch (error) {
      set({ isLoggingIn: false, user: null });
      toast.error(error.response.data.message || "Login failed");
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axios.post('/auth/logout');
      set({ user: null, isLoggingOut: false });
      toast.success("Logged out successfully");
    } catch (error) {
      set({ isLoggingOut: false, user: null });
      toast.error(error.response.data.message || "Logout failed");
    }
  },
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get('/auth/authCheck');
      set({ user: response.data.user, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
    }
  }
}));