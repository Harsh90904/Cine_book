const API = import.meta.env.VITE_API_URL ||'http://localhost:8090'

export async function getShowSeats(show_id) {
  const res = await fetch(`/seat/${show_id}`);
  return res.json();
}

export async function reserveSeats(show_id, seat_ids, user_id) {
  const res = await fetch(`${API}/booking/book-seats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ show_id, seat_ids, user_id }),
  });
  return res.json();
}
