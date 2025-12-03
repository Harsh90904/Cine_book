// Thater_Login

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";

const Thater_Login = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/thater/login", form);
      localStorage.setItem("thater_token", res.data.token);
      localStorage.setItem("thater_user", JSON.stringify(res.data.user));
      nav("/thater-dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={onSubmit} className="auth-form">
        <h2>Theater Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="error-msg">{error}</div>}
        <p> Don't have an account? <a href="/thater-signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Thater_Login;