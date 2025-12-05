// import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
// import Booking from "./components/Booking.jsx";
// import SeatSelection from "./components/SeatSelection";
import MovieDetails from "./components/movieDetails";
import Login from "./components/login";
import Signup from "./components/signup";
import Thater_Login from "./components/Thater_Login";
import Thater_Signup from "./components/Thater_signup";
import ThaterDashboard from "./components/thater-dashboard";
export default function App() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Home />} />
          <Route path="/movie/:movieId" element={<MovieDetails />} />
          {/* <Route path="/booking/:showId" element={<Booking />} /> */}
          {/* <Route path="/show/:show_id" element={<SeatSelection />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/thater_login" element={<Thater_Login />} />
          <Route path="/thater_signup" element={<Thater_Signup />} />
          <Route path="/thater-dashboard" element={<ThaterDashboard />} />
        </Routes>
      </main>
    </>
  );
}
