// import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserDetails } from "../userDetails";
import Cookies from "js-cookie";
import Ability from "../role/Ability";

const Navbar = () => {
  const nav = useNavigate();
  let user = getUserDetails();
  console.log("User in Navbar:", user);
  const handleLogout = () => {
    Cookies.remove("token");
    nav("/login");
  };
  return (
    <nav className=" mx-auto p-4 navbar bg-base-200 ">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Movie Booking
        </Link>
      </div>
      <div className="navbar-center">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/movies">Movies</Link>
          </li>
          <li>
            <Link to="/bookings">Bookings</Link>
          </li>
          <li>
            <Link to="/SeatSelection">SeatSelection</Link>
          </li>
          {!user && (
            <>
              <li>
                <Link to="/thater_login">Thater Login</Link>
              </li>
              <li>
                <Link to="/thater_signup">Thater Signup</Link>
              </li>
            </>
          )}
          {Ability(["admin"]) ? (
            <li className="nav-item">
              <Link className="nav-link" to="/assign">
                Assign
              </Link>
            </li>
          ) : null}
          {user ? (
            <li>
              <button onClick={handleLogout} className="btn btn-ghost">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
          <li className="nav-item">
            {user ? (
              <p className="nav-link"> {user.name}</p>
            ) : (
              <Link className="nav-link" to="/signup">
                Signup
              </Link>
            )}
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <form className="d-flex" role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
