import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserDetails } from "../userDetails";
import Cookies from "js-cookie";


const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const user = getUserDetails(); 
  console.log("user", user)
  const handleLogout = () => {
    Cookies.remove("user");
    navigate("/login");
  };
  const Ability = (roles = []) => {
  let role = getUserDetails()?.role;
  if (roles.includes(role)) {
    return true;
  } else {
    return false;
  }
};
  console.log("cookie", Cookies.get("user"))
  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = e.target.search.value.trim();
    if (searchQuery) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
      e.target.reset();
    }
  };

  // Common menu items
  const menuItems = (
    <>
      <li>
        <Link className="hover:bg-white hover:text-purple-900 rounded-lg" to="/">
          Home
        </Link>
      </li>
      <li>
        <Link className="hover:bg-white hover:text-purple-900 rounded-lg" to="/movies">
          Movies
        </Link>
      </li>
      <li>
        <Link className="hover:bg-white hover:text-purple-900 rounded-lg" to="/bookings">
          Bookings
        </Link>
      </li>
      <li>
        <Link className="hover:bg-white hover:text-purple-900 rounded-lg" to="/SeatSelection">
          Seat Selection
        </Link>
      </li>

      {/* Theater Login/Signup */}
      {!user || user.role !== "USER" ? (
        <>
          <li>
            <Link className="hover:bg-white hover:text-purple-900 rounded-lg" to="/thater_login">
              Theater Login
            </Link>
          </li>
          <li>
            <Link className="hover:bg-white hover:text-purple-900 rounded-lg" to="/thater_signup">
              Theater Signup
            </Link>
          </li>
        </>
      ) : null}

      {/* Admin link */}
      {Ability(["admin"]) && (
        <li>
          <Link className="hover:bg-white hover:text-purple-900 rounded-lg" to="/assign">
            Assign
          </Link>
        </li>
      )}
    </>
    
  );

  return (
    <nav className="navbar bg-gradient-to-r from-purple-900 to-indigo-900 shadow-lg sticky top-0 z-50 px-4 py-2">
      {/* Navbar Start */}
      <div className="navbar-start flex items-center">
        {/* Mobile Hamburger */}
        <div className="lg:hidden mr-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-ghost btn-circle focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <Link className="btn btn-ghost normal-case text-2xl font-bold text-white" to="/">
          🎬 CineBook
        </Link>
      </div>

      {/* Navbar Center - Desktop */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">{menuItems}</ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex">
          <input
            type="text"
            name="search"
            placeholder="Search movies..."
            className="input input-bordered input-sm w-32 lg:w-48 text-white"
          />
          <button type="submit" className="btn btn-sm btn-primary ml-2">
            Search
          </button>
        </form>

        {/* User Buttons */}
        {user ? (
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-white text-purple-900 flex items-center justify-center font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </button>
            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
              <li>
                <span className="pointer-events-none">{user.name}</span>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link className="btn btn-sm btn-outline btn-primary" to="/login">
              Login
            </Link>
            <Link className="btn btn-sm btn-primary" to="/signup">
              Signup
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-base-100 shadow-md z-50">
          <ul className="menu flex flex-col p-4 gap-2">{menuItems}</ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
