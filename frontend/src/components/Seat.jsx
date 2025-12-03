// Seat.js
import React from "react";
import PropTypes from "prop-types";

export default function Seat({ seat, isSelected, onClick }) {
  const getColor = () => {
    if (seat.status === "booked") return "#e62e2e"; // Red for booked
    if (seat.status === "reserved") return "#f4c430"; // Yellow for reserved
    if (isSelected) return "#4caf50"; // Green for selected
    return "#ddd"; // Grey for available
  };

  return (
    <div
      onClick={() => seat.status === "available" && onClick(seat.id)}
      style={{
        width: 35,
        height: 35,
        margin: 5,
        borderRadius: 6,
        background: getColor(),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: seat.status === "available" ? "pointer" : "not-allowed",
        fontSize: 12,
        fontWeight: 600,
        userSelect: "none",
      }}
      title={seat.status}
    >
      {seat.label}
    </div>
  );
}

Seat.propTypes = {
  seat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
