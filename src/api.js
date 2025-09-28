import axios from "axios";
import { useAppStore } from "./store";

export const API = axios.create({
  baseURL: "https://server2025.propertybusstop.com",
  // || "http://localhost:3000"
  headers: {
    Accept: "application/json",
  },
  // withCredentials: true, // for cookies if needed
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      // Use the logout function directly from the store
      useAppStore.getState().logout();
      // Redirect to the sign-in page
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

// Attach JWT token to all requests if present
API.interceptors.request.use(
  (config) => {
    let token;
    try {
      token = JSON.parse(localStorage.getItem("user"))?.token;
    } catch {
      token = null;
    }
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const signup = async (data) => {
  const payload = {
    user: {
      first_name: data.firstName,
      last_name: data.lastName,
      telephone: data.phone,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
    },
  };
  return API.post("/users", payload);
};

export const signin = async (data) => {
  const payload = {
    user: {
      email: data.email,
      password: data.password,
    },
  };
  return API.post("/users/sign_in", payload);
};

export const getStates = async () => {
  return API.get("/api/v1/states");
};

export const getLocalities = async (stateId) => {
  return API.get(`/api/v1/localities?state_id=${stateId}`);
};

export const getMyPropertiesCount = async (userId) => {
  return API.get(`/api/v1/properties/count?user_id=${userId}`);
};

export const getFeatures = async () => {
  return API.get("/api/v1/features");
};

export const createProperty = async (formData) => {
  return API.post("/api/v1/properties", formData);
};

export const updateUserProfile = async (data) => {
  const payload = {
    user: {
      first_name: data.first_name,
      last_name: data.last_name,
      telephone: data.telephone,
      email: data.email,
    },
  };
  return API.put("/users", payload);
};

export const deleteProperty = async (propertyId) => {
  return API.delete(`/api/v1/properties/${propertyId}.json`);
};

export const featuredProperties = async () => {
  return API.get("/api/v1/featured_properties");
};

export default API;
