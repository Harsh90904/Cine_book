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
    <div className="hero flex justify-center items-center min-h-screen">
      <form onSubmit={onSubmit} className="card p-7 shadow-lg w-full max-w-md shadow-[#303c58] text-center bg-white/10 border border-white/20 backdrop-blur-md flex items-center ">
        <h2 className="text-4xl py-4">Theater Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border border-white/20 placeholder-white/70 bg-white/10 mb-4 p-2 rounded-md w-full text-white"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="border border-white/20 placeholder-white/70 bg-white/10 mb-4 p-2 rounded-md w-full text-white"
        />
        <button className="bg-white/20 w-20 h-10 cursor-pointer rounded-xl hover:border border-white  " type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="error-msg">{error}</div>}
        <p className="pt-4"> Don`t have an account? <a className="  cursor-pointer rounded-xl hover:text-[#636363]  " href="/thater-signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Thater_Login;