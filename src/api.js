import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // for cookies if needed
});

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

export default API;
