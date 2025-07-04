import axios from "axios";
// Import only for type, not for hook usage
// import { useAppStore } from "./store";

const API = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // for cookies if needed
});

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
  // Rails expects user params nested under 'user'
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
  // Rails expects user params nested under 'user'
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

export default API;
