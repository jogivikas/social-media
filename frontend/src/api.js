// src/api.js
import axios from "axios";

const base = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/+$/, "");
const api = axios.create({
  baseURL: base,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((cfg) => {
  console.log(
    "API request =>",
    (cfg.method || "GET").toUpperCase(),
    cfg.baseURL + cfg.url
  );
  return cfg;
});

api.interceptors.response.use(
  (res) => {
    console.log("API response from", res.config.url, res.data);
    return res;
  },
  (err) => {
    if (err.response) {
      console.error(
        "API response error:",
        err.response.status,
        err.response.data
      );
    } else if (err.request) {
      console.error("No response received:", err.request);
    } else {
      console.error("Request setup error:", err.message);
    }
    return Promise.reject(err);
  }
);

// adjust these wrappers to match backend endpoints
export const getAllPosts = () => api.get("/posts");
export const createPost = (formData) =>
  api.post("/post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deletePost = (payload) => api.post("/delete_post", payload);
export const commentPost = (payload) => api.post("/comment", payload);
export const getComments = (payload) => api.post("/get_comments", payload);
export const likePost = (payload) => api.post("/increment_post_likes", payload);

// auth/user
export const register = (data) => api.post("/register", data);
export const login = (data) => api.post("/login", data);
export const getProfile = (payload) => api.post("/get_profile", payload);
export const uploadProfilePicture = (formData) =>
  api.post("/upload_profile_picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateProfileData = (data) =>
  api.post("/update_profile_data", data);

export const getAllUsers = () => api.get("/user/get_all_users");
export const sendConnectionRequest = (data) =>
  api.post("/user/send_connection_request", data);
export const getMyConnectionRequests = () =>
  api.get("/user/get_connection_request");
export const acceptConnectionRequest = (data) =>
  api.post("/user/accept_connection_request", data);

export default api;
