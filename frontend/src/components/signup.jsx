import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";

const User_signup = () => {
  const nav = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    moblie_number: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInput = (e) => setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onsubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/user/signup", user);
      console.log("signup success", res.data);
      nav("/login");
    } catch (err) {
      console.error("signup error", err);
      const msg = err?.response?.data?.message || err?.response?.data || err.message;
      setError(String(msg));
    }
  };

  return (
    <form onSubmit={onsubmit}>
      <input name="name" value={user.name} onChange={handleInput} placeholder="Name" />
      <input name="email" value={user.email} onChange={handleInput} placeholder="Email" />
      <input name="moblie_number" value={user.moblie_number} onChange={handleInput} placeholder="Mobile" />
      <input name="password" type="password" value={user.password} onChange={handleInput} placeholder="Password" />
      <button type="submit">Sign up</button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default User_signup;
