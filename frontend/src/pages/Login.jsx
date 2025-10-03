// src/pages/Login.jsx
import React, { useState } from "react";
import api, { login as loginEndpoint } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // can be username or email
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  // helper: try to login at a given path with a given payload
  const tryPost = async (path, payload) => {
    try {
      console.log("Trying", path, payload);
      const res = await api.post(path, payload);
      console.log("Response from", path, res.data);
      return { ok: true, data: res.data };
    } catch (err) {
      console.warn("Error from", path, err?.response?.status, err?.response?.data);
      return { ok: false, status: err?.response?.status, data: err?.response?.data };
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    // try payload shapes:
    // 1) { username, password }
    // 2) { email, password }
    // try endpoints in order: /login, /user/login
    const payloads = [
      { username: identifier, password },
      { email: identifier, password },
    ];
    const endpoints = ["/login", "/user/login"];

    for (const ep of endpoints) {
      for (const payload of payloads) {
        const result = await tryPost(ep, payload);
        if (result.ok) {
          // success — navigate home (or store token if your backend returns one)
          alert("Logged in");
          // if backend returns token, store it (example)
          if (result.data?.token) {
            localStorage.setItem("token", result.data.token);
            // attach token to future requests (optional)
            api.defaults.headers.common["Authorization"] = `Bearer ${result.data.token}`;
          }
          nav("/");
          return;
        } else {
          // if server explicitly said user not exist, continue trying other payloads/endpoints
          const serverMsg = result.data?.message || result.data;
          console.log("Server reply:", serverMsg);
          // if it's a 401/403 etc, show message and stop trying
          if (result.status && [401, 403].includes(result.status)) {
            alert(serverMsg || "Login failed");
            return;
          }
        }
      }
    }

    // if we reach here all attempts failed
    alert("Login failed — check username/email and password. See console for server response.");
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white p-4 rounded shadow">
      <h2 className="text-xl mb-3">Login</h2>

      <input
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder="Username or Email"
        className="w-full border p-2 mb-2"
        required
      />

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        className="w-full border p-2 mb-2"
        required
      />

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>

      <p className="mt-2 text-sm text-gray-500">
        Tip: use the same username or email you registered with.
      </p>
    </form>
  );
}
