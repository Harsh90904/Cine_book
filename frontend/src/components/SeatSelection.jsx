// SeatSelection.js
import React, { useEffect, useState } from "react";
import { getShowSeats, reserveSeats } from "../config/bookingApi.js";
import SeatGrid from "./SeatGrid";
import { useParams } from "react-router-dom";

export default function SeatSelection() {
  const { show_id } = useParams();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const user_id = 1;

  useEffect(() => {
    (async () => {
      const data = await getShowSeats(show_id);
      setSeats(data);
    })();
  }, [show_id]);

  const toggleSeat = (seat_id) => {
    setSelected((prev) =>
      prev.includes(seat_id) ? prev.filter((id) => id !== seat_id) : [...prev, seat_id]
    );
  };

  const handleBooking = async () => {
    if (selected.length === 0) return alert("Select at least one seat!");
    const res = await reserveSeats(show_id, selected, user_id);
    alert(res.message);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Seat Selection</h2>

      <SeatGrid seats={seats} selected={selected} toggle={toggleSeat} />

      <button
        onClick={handleBooking}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#1976d2",
          color: "#fff",
          border: 0,
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Book Now
      </button>
    </div>
  );
}
