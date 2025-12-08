import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';

const Signup = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/user/signup', form);
      cookieStore.set("user",res.data.token);
      nav('/');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero flex justify-center items-center min-h-screen">
      <form onSubmit={onSubmit}  className="card p-7 shadow-lg w-full max-w-md shadow-[#303c58] text-center bg-white/10 border border-white/20 backdrop-blur-md flex items-center ">
        <h2 className="text-4xl py-4">User Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
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
          name="phone"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={handleChange}
          className="border border-white/20 placeholder-white/70 bg-white/10 mb-4 p-2 rounded-md w-full text-white"
        />
        
        <button className="bg-white/20 w-20 h-10 cursor-pointer rounded-xl hover:border border-white  " type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <div className="error-msg">{error}</div>}
        <p className="pt-4">
          Already have an account? <a className="  cursor-pointer rounded-xl hover:text-[#636363]  " href="/user-login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
