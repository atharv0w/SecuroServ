// src/auth.jsx

// === SecureVault Auth Utility ===
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/* -------------------------------------------------------------------------- */
/* 🧭 Getters                                                                 */
/* -------------------------------------------------------------------------- */
export const getToken = () => localStorage.getItem("sv_token") || null;
export const getRole = () => localStorage.getItem("sv_role") || null;
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("sv_user") || "null");
  } catch {
    return null;
  }
};

/* -------------------------------------------------------------------------- */
/* 🔐 Auth State Management                                                   */
/* -------------------------------------------------------------------------- */
export const setAuth = ({ token, role, user }) => {
  // ✅ Strict token validation (must be a valid JWT)
  const isValidToken =
    typeof token === "string" &&
    token.split(".").length === 3 &&
    token.trim() !== "" &&
    token !== "null" &&
    token !== "undefined";

  if (isValidToken) {
    localStorage.setItem("sv_token", token);
  } else {
    // Prevent storing "true", null, [object Object], etc.
    console.warn("[SecureVault] Invalid token detected → clearing storage");
    localStorage.removeItem("sv_token");
  }

  if (role) localStorage.setItem("sv_role", role);
  if (user) localStorage.setItem("sv_user", JSON.stringify(user));
};

/* -------------------------------------------------------------------------- */
/* 🧹 Clear Everything                                                        */
/* -------------------------------------------------------------------------- */
export const clearAuth = () => {
  localStorage.removeItem("sv_token");
  localStorage.removeItem("sv_role");
  localStorage.removeItem("sv_user");
};

/* -------------------------------------------------------------------------- */
/* 🧼 Sanitize Storage on Startup                                             */
/* -------------------------------------------------------------------------- */
export const sanitizeAuthStorage = () => {
  const token = localStorage.getItem("sv_token");

  const isInvalid =
    !token ||
    token === "null" ||
    token === "undefined" ||
    token === "[object Object]" ||
    token === "true" ||
    (typeof token === "string" && token.split(".").length !== 3);

  if (isInvalid) {
    console.warn("[SecureVault] Invalid token in storage → clearing auth");
    clearAuth();
  }
};

/* -------------------------------------------------------------------------- */
/* 🧾 Fetch User Info                                                         */
/* -------------------------------------------------------------------------- */
export const fetchMe = async () => {
  const token = getToken();

  // 🧠 Validate before using
  if (
    !token ||
    typeof token !== "string" ||
    token.split(".").length !== 3 ||
    token === "null" ||
    token === "undefined"
  ) {
    console.warn("[SecureVault:fetchMe] Skipping invalid token");
    clearAuth();
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Auth /me failed");
    const data = await res.json();

    const role = data?.role || data?.user?.role || data?.data?.role || "user";
    const user = data?.user || data || null;

    setAuth({ token, role, user });
    return { role, user };
  } catch (err) {
    console.warn("[SecureVault:fetchMe] Fallback to JWT decode");

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role =
        payload?.role || payload?.roles?.[0] || payload?.userType || "user";
      setAuth({ token, role });
      return { role, user: null };
    } catch {
      console.error("[SecureVault:fetchMe] Token decode failed → clearing auth");
      clearAuth();
      return null;
    }
  }
};
