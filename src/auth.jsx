const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE ||
  "/api";

export const getToken = () => {
  const possibleKeys = ["sv_token", "token", "authToken", "sv_auth"];
  for (const key of possibleKeys) {
    const val = localStorage.getItem(key);
    if (val && typeof val === "string" && val.split(".").length === 3) {
      return val;
    }
  }
  return null;
};

export const getRole = () => localStorage.getItem("sv_role") || "USER";

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("sv_user") || "null");
  } catch {
    return null;
  }
};
export const setAuth = ({ token, role, user }) => {
  
  const isValidToken =
    typeof token === "string" &&
    token.split(".").length === 3 &&
    token.trim() !== "" &&
    token !== "null" &&
    token !== "undefined";

  if (isValidToken) {
    localStorage.setItem("sv_token", token);
  } else {
    console.warn("[SecureVault] Invalid token detected → clearing storage");
    clearAuth();
  }

  if (role) localStorage.setItem("sv_role", role.toUpperCase());
  if (user) localStorage.setItem("sv_user", JSON.stringify(user));
};
export const clearAuth = () => {
  const keys = [
    "sv_token",
    "token",
    "authToken",
    "sv_auth",
    "sv_role",
    "sv_user",
  ];
  keys.forEach((k) => localStorage.removeItem(k));
};
export const sanitizeAuthStorage = () => {
  const token = getToken();
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
export const fetchMe = async () => {
  const token = getToken();

  if (!token) {
    console.warn("[SecureVault:fetchMe] No valid token found");
    clearAuth();
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true", 
        "X-Auth-Token": token, 
        "X-Session-Token": token, 
      },
      credentials: "include", 
    });

    if (!res.ok) throw new Error(`Auth /me failed (${res.status})`);
    const data = await res.json();

    
    const role = data?.role || data?.user?.role || "USER";
    const user = data?.user || data;

    setAuth({ token, role, user });
    return { role, user };
  } catch (err) {
    console.warn("[SecureVault:fetchMe] Fallback to JWT decode", err.message);

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role =
        payload?.role || payload?.roles?.[0] || payload?.userType || "USER";
      setAuth({ token, role });
      return { role, user: null };
    } catch (decodeErr) {
      console.error("[SecureVault:fetchMe] Token decode failed → clearing auth");
      clearAuth();
      return null;
    }
  }
};
