import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Shield, Loader2 } from "lucide-react";
import { setAuth, fetchMe } from "../auth";

// --- validators ---
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const isEmail = (v) => emailRegex.test(v) && v.length <= 254;

// 3–20, start with letter, letters/numbers/._-, not all digits
const isUsername = (v) =>
  /^[A-Za-z][A-Za-z0-9._-]{2,19}$/.test(v) && !/^\d+$/.test(v);

const validatePassword = (password) => password.length >= 6 && password.length <= 128;

export default function LogInPage({
  loginEndpoint =
    (typeof import.meta !== "undefined"
      ? import.meta.env.VITE_API_BASE
      : process.env.REACT_APP_API_BASE) ||
    "https://lucille-unbatted-monica.ngrok-free.dev/",
  onSuccessNavigateTo = "/dashboard", // change if you want
}) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [touched, setTouched] = useState({ id: false, password: false });

  const idIsEmail = useMemo(() => isEmail(identifier.trim()), [identifier]);
  const idIsUsername = useMemo(() => isUsername(identifier.trim()), [identifier]);

  const idIsValid = idIsEmail || idIsUsername;
  const passwordIsValid = validatePassword(password.trim());

  useEffect(() => {
    if (!message.text) return;
    const t = setTimeout(() => setMessage({ type: "", text: "" }), message.type === "success" ? 3000 : 5000);
    return () => clearTimeout(t);
  }, [message]);

  const loginApiCall = async (identifier, password) => {
    const url = `${loginEndpoint.replace(/\/+$/, "")}/auth/login`;
    const body = idIsEmail
      ? { email: identifier.trim(), password }
      : { username: identifier.trim(), password };

    let resp;
    try {
      resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "*/*" },
        body: JSON.stringify(body),
        credentials: "include",
      });
    } catch {
      throw new Error("Network error. Check your connection.");
    }

    const ct = resp.headers.get("content-type") || "";
    let data;
    try {
      data = ct.includes("application/json") ? await resp.json() : await resp.text();
    } catch {
      data = null;
    }

    if (!resp.ok) {
      const msg =
        (typeof data === "object" && (data?.message || data?.error)) ||
        (typeof data === "string" && data) ||
        `Login failed (${resp.status})`;
      throw new Error(msg);
    }

    if (typeof data === "string") {
      return { token: data.trim(), user: null, raw: data };
    }
    const token = data?.token || data?.accessToken || data?.jwt || null;
    const user = data?.user || data?.data?.user || null;
    return { token, user, raw: data };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ id: true, password: true });
    setMessage({ type: "", text: "" });

    if (!idIsValid || !passwordIsValid) {
      setMessage({ type: "error", text: "Please enter valid credentials." });
      return;
    }

    setLoading(true);
    try {
      const res = await loginApiCall(identifier, password);
      if (!res?.token) throw new Error("No token in response.");

      let role = res?.user?.role || null;
      setAuth({ token: res.token, role, user: res.user || null });

      if (!role) {
        const me = await fetchMe();
        role = me?.role || "user";
        setAuth({ token: res.token, role, user: me?.user || null });
      }

      setMessage({ type: "success", text: "Login successful!" });

      // tiny delay so localStorage writes settle
      setTimeout(() => navigate(onSuccessNavigateTo, { replace: true }), 120);
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 p-8">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-7 h-7 text-white" />
          <span className="text-2xl font-bold text-white">SecuroServ</span>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1.5">Welcome back</h1>
          <p className="text-sm text-zinc-500">Log in with your email</p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-5 p-3 rounded-lg text-xs flex items-center gap-2 ${
              message.type === "error"
                ? "bg-red-950/30 border border-red-900/50 text-red-400"
                : "bg-emerald-950/30 border border-emerald-900/50 text-emerald-400"
            }`}
            role="alert"
          >
            <AlertCircle size={14} />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username / Email */}
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-zinc-400 mb-2">
              Email
            </label>
            <input
              id="id"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, id: true }))}
              className={`w-full px-4 py-2.5 bg-zinc-900 border rounded-lg focus:outline-none transition-all text-white placeholder-zinc-600 ${
                touched.id && !idIsValid
                  ? "border-red-500/50 shadow-lg shadow-red-500/10"
                  : "border-zinc-800 focus:border-white hover:border-zinc-700"
              }`}
              placeholder="you@mail.com"
              disabled={loading}
              autoComplete="username"
            />
            {touched.id && !idIsValid && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={12} />
                Enter a valid email.
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className={`w-full px-4 py-2.5 pr-11 bg-zinc-900 border rounded-lg focus:outline-none transition-all text-white placeholder-zinc-600 ${
                  touched.password && !passwordIsValid
                    ? "border-red-500/50 shadow-lg shadow-red-500/10"
                    : "border-zinc-800 focus:border-white hover:border-zinc-700"
                }`}
                placeholder="••••••••••••"
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-400 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched.password && !passwordIsValid && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={12} />
                Enter a valid Password.
              </p>
            )}
            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-xs text-white hover:text-zinc-300 underline">
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-zinc-900 pt-6">
          <p className="text-xs text-zinc-500">
            New to Vault?{" "}
            <Link to="/signup" className="text-white hover:text-zinc-300 font-medium transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
