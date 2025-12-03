// SeatGrid.js
import React from "react";
import Seat from "./Seat";
import PropTypes from "prop-types";

function SeatGrid({ seats, selected, toggle }) {
  const rows = {};

  // Group seats by row
  seats.forEach((seat) => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });

  return (
    <div style={{ marginTop: 20 }}>
      {/* Screen Indicator */}
      <div
        style={{
          marginBottom: 20,
          width: "100%",
          height: 20,
          background: "#bbb",
          borderRadius: 4,
          textAlign: "center",
          lineHeight: "20px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        SCREEN
      </div>

      {/* Seats */}
      {Object.keys(rows).map((rowKey) => (
        <div key={rowKey} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <div style={{ width: 20, marginRight: 10, fontWeight: "bold" }}>{rowKey}</div>
          {rows[rowKey].map((s) => (
            <Seat key={s.id} seat={s} isSelected={selected.includes(s.id)} onClick={toggle} />
          ))}
        </div>
      ))}

      {/* Legend */}
      <div style={{ marginTop: 20, display: "flex", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 20, height: 20, background: "#ddd", borderRadius: 4 }} />
          Available
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 20, height: 20, background: "#4caf50", borderRadius: 4 }} />
          Selected
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 20, height: 20, background: "#e62e2e", borderRadius: 4 }} />
          Booked
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 20, height: 20, background: "#f4c430", borderRadius: 4 }} />
          Reserved
        </div>
      </div>
    </div>
  );
}

SeatGrid.propTypes = {
  seats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      row: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selected: PropTypes.array.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default SeatGrid;
