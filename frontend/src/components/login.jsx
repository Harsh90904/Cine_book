import  { useState } from "react";
import  API  from "../config/api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const User_login = () => {
  const nav = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const handleInput = (e) => {
    let { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const createUser = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/user/login", user);
      const { userId, token } = response.data;
      console.log(response.data);
      Cookies.set("userId", userId);
      Cookies.set("token", token);
      nav("/");
    } catch (error) {
      console.error("Error during user login:", error);
    }
  };
  const onsubmit = (e) => {
    e.preventDefault();
    console.log(user);
    createUser(e);
  };
  return (
    <div>
      <form onSubmit={onsubmit}>
        <h2>User Login</h2>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleInput}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleInput}
          required
        />
        <button type="submit" value={"Login"}>Login</button>
      </form>
    </div>
  );
};
export default User_login;
