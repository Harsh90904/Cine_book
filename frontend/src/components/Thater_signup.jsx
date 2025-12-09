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
      cookieStore.set("thater_token",res.data.token);
      cookieStore.set("thater_user",JSON.stringify(res.data.user));
      nav("/thater-dashboard.jsx");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero flex justify-center items-baseline min-h-screen  ">
      <form
        onSubmit={onSubmit}
        className="card p-7 shadow-lg w-full max-w-md shadow-[#303c58] text-center bg-white/10 border border-white/20 backdrop-blur-md flex items-center "
        encType="multipart/form-data"
      >
        <h2 className="text-4xl py-4">Theater Sign Up</h2>
      <div></div>
        <input
          type="text"
          name="name"
          placeholder="Theater Name"
          value={form.name}
          onChange={handleChange}
          required
           className="border border-white/20 placeholder-white/70 bg-white/10 mb-4 p-2 rounded-md w-full text-white"
        />
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
        <input
          type="tel"
          name="contact_number"
          placeholder="Contact Number"
          value={form.contact_number}
          onChange={handleChange}
          required
           className="border border-white/20 placeholder-white/70 bg-white/10 mb-4 p-2 rounded-md w-full text-white"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
           className="border border-white/20 placeholder-white/70 bg-white/10 mb-4 p-2 rounded-md w-full text-white"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
           className="border border-white/20 placeholder-white/70 bg-white/10 mb-4 p-2 rounded-md w-full text-white"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
           className="border border-white/20 placeholder-white/70 bg-white/10 mb-4 p-2 rounded-md w-full text-white"
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
           className="border border-white/20 placeholder-white/70 bg-white/10 mb-4 p-2 rounded-md w-full text-white"
        />
        <input
          type="number"
          name="total_screens"
          placeholder="Total Screens"
          value={form.total_screens}
          onChange={handleChange}
           className="border border-white/20 placeholder-white/70 bg-white/10 mb-4 p-2 rounded-md w-full text-white"
        />
        <input
          type="number"
          name="total_seats"
          placeholder="Total Seats"
          value={form.total_seats}
          onChange={handleChange}
           className="border border-white/20 placeholder-white/70 bg-white/10 mb-4 p-2 rounded-md w-full text-white"
        />
        <input
          type="file"
          multiple
          onChange={handleImages}
          accept="image/*"
           className="border border-white/20 placeholder-white/70 bg-white/10 mb-4 p-2 rounded-md w-full text-white"
        />
        <button className="bg-white/20 w-20 h-10 cursor-pointer rounded-xl hover:border border-white  " type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <div className="error-msg">{error}</div>}
        <p  className="pt-4">
          Already have an account? <a className="  cursor-pointer rounded-xl hover:text-[#636363]  " href="/thater-signup" >Login</a>
        </p>
      </form>
    </div>
  );
};

export default Thater_signup;