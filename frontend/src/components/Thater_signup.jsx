import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
// import Seat from "./Seat";

const Thater_signup = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    Seat_layout: {},
    total_screens: "",
    total_seats: "",
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImages = (e) => {
    setImages(Array.from(e.target.files || []));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== undefined && form[key] !== null) {
          formData.append(key, String(form[key]));
        }
      });
      images.forEach((file) => formData.append("images", file));

      const res = await API.post("/Thater", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("thater_token", res.data.token);
      localStorage.setItem("thater_user", JSON.stringify(res.data.user));
      nav("/thater-dashboard.jsx");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form
        onSubmit={onSubmit}
        className="auth-form"
        encType="multipart/form-data"
      >
        <h2>Theater Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Theater Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
        <input
          type="tel"
          name="contact_number"
          placeholder="Contact Number"
          value={form.contact_number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
        />
        <input
          type="number"
          name="total_screens"
          placeholder="Total Screens"
          value={form.total_screens}
          onChange={handleChange}
        />
        <input
          type="number"
          name="total_seats"
          placeholder="Total Seats"
          value={form.total_seats}
          onChange={handleChange}
        />
        <input
          type="file"
          multiple
          onChange={handleImages}
          accept="image/*"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <div className="error-msg">{error}</div>}
        <p>
          Already have an account? <a href="/thater-login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Thater_signup;