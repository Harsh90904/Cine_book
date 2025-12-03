import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
import "../styles/thater-dashboard.css";

const ThaterDashboard = () => {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [theater, setTheater] = useState(null);
  const [screens, setScreens] = useState([]);
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Screen Modal states
  const [showScreenModal, setShowScreenModal] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [screenForm, setScreenForm] = useState({
    name: "",
    seat_count: "",
    type: "2D",
    is_active: true,
  });

  // Show Modal states
  const [showShowModal, setShowShowModal] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [showForm, setShowForm] = useState({
    screen_id: "",
    movie_id: "",
    start_time: "",
    end_time: "",
    ticket_price: "",
    status: "active",
  });

  useEffect(() => {
    const token = localStorage.getItem("thater_token");
    const userData = localStorage.getItem("thater_user");

    if (!token || !userData) {
      nav("/thater-login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchTheaterData(parsedUser.id);
    fetchMovies();
  }, [nav]);

  const fetchTheaterData = async (theaterId) => {
    try {
      setLoading(true);
      const [theaterRes, screensRes, showsRes] = await Promise.all([
        API.get(`/thater/${theaterId}`),
        API.get(`/screen/thater/${theaterId}`),
         API.get(`/show/thater/${theaterId}`),
      ]);

      setTheater(theaterRes.data);
      setScreens(Array.isArray(screensRes.data) ? screensRes.data : []);
      setShows(Array.isArray(showsRes.data) ? showsRes.data : []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load theater data");
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const res = await API.get("/movie"); // changed from "/movies"
      setMovies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  // ===== SCREEN HANDLERS =====
  const handleAddScreen = async (e) => {
    e.preventDefault();
    try {
      if (!screenForm.name || !screenForm.seat_count) {
        alert("Screen name and seat count are required");
        return;
      }

      const token = localStorage.getItem("thater_token");
      if (editingScreen) {
        // Update existing screen
        await API.patch(`/screen/${editingScreen.id}`, screenForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMsg("Screen updated successfully!");
      } else {
        // Add new screen
        await API.post(`/thater/${user.id}/screens`, screenForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMsg("Screen added successfully!");
      }

      resetScreenForm();
      setTimeout(() => fetchTheaterData(user.id), 500);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save screen");
    }
  };

  const handleEditScreen = (screen) => {
    setEditingScreen(screen);
    setScreenForm({
      name: screen.name,
      seat_count: screen.seat_count,
      type: screen.type,
      is_active: screen.is_active,
    });
    setShowScreenModal(true);
  };

  const handleDeleteScreen = async (screenId) => {
    if (!window.confirm("Are you sure you want to delete this screen?")) return;

    try {
      const token = localStorage.getItem("thater_token");
      await API.delete(`/screen/${screenId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg("Screen deleted successfully!");
      fetchTheaterData(user.id);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete screen");
    }
  };

  const resetScreenForm = () => {
    setScreenForm({ name: "", seat_count: "", type: "2D", is_active: true });
    setEditingScreen(null);
    // removed setShowScreenModal(false) to avoid closing when resetting
  };

  const closeScreenModal = () => {
    setShowScreenModal(false);
    resetScreenForm();
  };

  // ===== SHOW HANDLERS =====
  const handleAddShow = async (e) => {
    e.preventDefault();
    try {
      if (!showForm.screen_id || !showForm.movie_id || !showForm.start_time || !showForm.ticket_price) {
        alert("Please fill all required fields");
        return;
      }

      const token = localStorage.getItem("thater_token");
      const payload = {
        ...showForm,
        theater_id: user.id,
      };

      if (editingShow) {
        await API.patch(`/show/${editingShow.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMsg("Show updated successfully!");
      } else {
        await API.post(`/show`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMsg("Show added successfully!");
      }

      resetShowForm();
      setTimeout(() => fetchTheaterData(user.id), 500);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save show");
    }
  };

  const handleEditShow = (show) => {
    setEditingShow(show);
    setShowForm({
      screen_id: String(show.screen_id || show.screen?.id || ""),
      movie_id: String(show.movie_id || show.movie?.id || ""),
      start_time: show.start_time,
      end_time: show.end_time || "",
      ticket_price: show.ticket_price,
      status: show.status || "active",
    });
    setShowShowModal(true);
  };

  const handleDeleteShow = async (showId) => {
    if (!window.confirm("Are you sure you want to delete this show?")) return;

    try {
      const token = localStorage.getItem("thater_token");
      await API.delete(`/show/${showId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg("Show deleted successfully!");
      fetchTheaterData(user.id);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete show");
    }
  };

  const resetShowForm = () => {
    setShowForm({
      screen_id: "",
      movie_id: "",
      start_time: "",
      end_time: "",
      ticket_price: "",
      status: "active",
    });
    setEditingShow(null);
    // removed setShowShowModal(false)
  };

  const closeShowModal = () => {
    setShowShowModal(false);
    resetShowForm();
  };

  const handleLogout = () => {
    localStorage.removeItem("thater_token");
    localStorage.removeItem("thater_user");
    nav("/thater-login");
  };

  // currently selected movie for preview in modal
  const selectedMovie = movies.find((m) => String(m.id) === String(showForm.movie_id));
  
  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="thater-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🎬 Theater Dashboard</h1>
          <p>{theater?.name}</p>
        </div>
        <div className="header-right">
          <span className="user-info">{user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Messages */}
      {error && <div className="error-banner">{error}</div>}
      {successMsg && <div className="success-banner">{successMsg}</div>}

      {/* Navigation Tabs */}
      <nav className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "screens" ? "active" : ""}`}
          onClick={() => setActiveTab("screens")}
        >
          🎞️ Screens ({screens.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "shows" ? "active" : ""}`}
          onClick={() => setActiveTab("shows")}
        >
          🎥 Shows ({shows.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          🎫 Bookings
        </button>
      </nav>

      {/* Content Area */}
      <main className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <section className="overview-section">
            <h2>Theater Information</h2>
            <div className="info-grid">
              <div className="info-card">
                <h3>Theater Name</h3>
                <p>{theater?.name}</p>
              </div>
              <div className="info-card">
                <h3>Email</h3>
                <p>{theater?.email}</p>
              </div>
              <div className="info-card">
                <h3>Contact Number</h3>
                <p>{theater?.contact_number || "N/A"}</p>
              </div>
              <div className="info-card">
                <h3>Location</h3>
                <p>
                  {theater?.city}, {theater?.state} - {theater?.pincode}
                </p>
              </div>
              <div className="info-card">
                <h3>Total Screens</h3>
                <p className="stat-number">{screens.length}</p>
              </div>
              <div className="info-card">
                <h3>Total Shows</h3>
                <p className="stat-number">{shows.length}</p>
              </div>
            </div>

            {theater?.images && theater.images.length > 0 && (
              <div className="images-section">
                <h3>Theater Images</h3>
                <div className="images-grid">
                  {theater.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Theater ${idx + 1}`}
                      className="theater-image"
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Screens Tab */}
        {activeTab === "screens" && (
          <section className="screens-section">
            <div className="section-header">
              <h2>Manage Screens</h2>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditingScreen(null);
                  resetScreenForm();
                  setShowScreenModal(true);
                }}
              >
                + Add Screen
              </button>
            </div>

            {screens.length === 0 ? (
              <div className="empty-state">
                <p>No screens added yet. Create your first screen!</p>
              </div>
            ) : (
              <div className="screens-grid">
                {screens.map((screen) => (
                  <div key={screen.id} className="screen-card">
                    <h3>{screen.name}</h3>
                    <div className="screen-details">
                      <p>
                        <strong>Type:</strong> {screen.type}
                      </p>
                      <p>
                        <strong>Seats:</strong> {screen.seat_count}
                      </p>
                      <p>
                        <strong>Status:</strong>
                        <span className={screen.is_active ? "active" : "inactive"}>
                          {screen.is_active ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                    <div className="card-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => handleEditScreen(screen)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-secondary danger"
                        onClick={() => handleDeleteScreen(screen.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add/Edit Screen Modal */}
            {showScreenModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h3>{editingScreen ? "Edit Screen" : "Add New Screen"}</h3>
                    <button className="close-btn" onClick={closeScreenModal}>
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleAddScreen} className="screen-form">
                    <div className="form-group">
                      <label>Screen Name *</label>
                      <input
                        type="text"
                        placeholder="e.g., Screen 1, IMAX"
                        value={screenForm.name}
                        onChange={(e) =>
                          setScreenForm((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Number of Seats *</label>
                      <input
                        type="number"
                        placeholder="e.g., 150"
                        value={screenForm.seat_count}
                        onChange={(e) =>
                          setScreenForm((p) => ({
                            ...p,
                            seat_count: parseInt(e.target.value),
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Screen Type</label>
                      <select
                        value={screenForm.type}
                        onChange={(e) =>
                          setScreenForm((p) => ({ ...p, type: e.target.value }))
                        }
                      >
                        <option value="2D">2D</option>
                        <option value="3D">3D</option>
                        <option value="IMAX">IMAX</option>
                        <option value="4DX">4DX</option>
                      </select>
                    </div>
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        checked={screenForm.is_active}
                        onChange={(e) =>
                          setScreenForm((p) => ({
                            ...p,
                            is_active: e.target.checked,
                          }))
                        }
                      />
                      <label>Active Screen</label>
                    </div>
                    <div className="modal-actions">
                      <button type="submit" className="btn-primary">
                        {editingScreen ? "Update Screen" : "Add Screen"}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={closeScreenModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Shows Tab */}
        {activeTab === "shows" && (
          <section className="shows-section">
            <div className="section-header">
              <h2>Manage Shows</h2>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditingShow(null);
                  resetShowForm();
                  setShowShowModal(true);
                }}
              >
                + Add Show
              </button>
            </div>

            {shows.length === 0 ? (
              <div className="empty-state">
                <p>No shows scheduled yet. Create your first show!</p>
              </div>
            ) : (
              <div className="shows-table">
                <table>
                  <thead>
                    <tr>
                      <th>Movie</th>
                      <th>Screen</th>
                      <th>Start Time</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shows.map((show) => {
                      const movieFromList = movies.find((m) => String(m.id) === String(show.movie_id));
                      const moviePoster =
                        show.movie?.poster_url ||
                        movieFromList?.poster_url ||
                        movieFromList?.poster ||
                        "/placeholder-movie.png";
                      const movieTitle =
                        show.movie?.title ||
                        movieFromList?.title ||
                        "N/A";
                      return (
                        <tr key={show.id}>
                          <td>
                            <div className="movie-cell" style={{display:'flex',alignItems:'center',gap:8}}>
                              <img
                                src={moviePoster}
                                alt={movieTitle}
                                style={{width:48,height:68,objectFit:'cover',borderRadius:4}}
                                onError={(e)=> (e.currentTarget.src='/placeholder-movie.png')}
                              />
                              <div>{movieTitle}</div>
                            </div>
                          </td>
                          <td>
                            {show.screen?.name ||
                              screens.find((s) => String(s.id) === String(show.screen_id))?.name ||
                              "N/A"}
                          </td>
                          <td>{new Date(show.start_time).toLocaleString()}</td>
                          <td>₹{show.ticket_price}</td>
                          <td>
                            <span className="status-badge">{show.status}</span>
                          </td>
                          <td>
                            <button
                              className="btn-small"
                              onClick={() => handleEditShow(show)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-small danger"
                              onClick={() => handleDeleteShow(show.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add/Edit Show Modal */}
            {showShowModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h3>{editingShow ? "Edit Show" : "Add New Show"}</h3>
                    <button className="close-btn" onClick={closeShowModal}>
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleAddShow} className="show-form">
                    <div className="form-group">
                      <label>Select Screen *</label>
                      <select
                        value={showForm.screen_id}
                        onChange={(e) =>
                          setShowForm((p) => ({
                            ...p,
                            screen_id: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="">-- Choose Screen --</option>
                        {screens.map((screen) => (
                          <option key={screen.id} value={screen.id}>
                            {screen.name} ({screen.seat_count} seats)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Select Movie *</label>
                      <select
                        value={showForm.movie_id}
                        onChange={(e) =>
                          setShowForm((p) => ({
                            ...p,
                            movie_id: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="">-- Choose Movie --</option>
                        {movies.map((movie) => (
                          <option key={movie.id} value={movie.id}>
                            {movie.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* movie preview */}
                    {selectedMovie && (
                      <div className="movie-preview" style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                        <img
                          src={selectedMovie.poster_url || selectedMovie.poster || '/placeholder-movie.png'}
                          alt={selectedMovie.title}
                          style={{width:80,height:120,objectFit:'cover',borderRadius:6}}
                          onError={(e)=> (e.currentTarget.src='/placeholder-movie.png')}
                        />
                        <div>
                          <strong>{selectedMovie.title}</strong>
                          <div style={{fontSize:12,color:'#666'}}>{selectedMovie.genre || selectedMovie.category}</div>
                        </div>
                      </div>
                    )}
                    <div className="form-group">
                      <label>Start Time *</label>
                      <input
                        type="datetime-local"
                        value={showForm.start_time}
                        onChange={(e) =>
                          setShowForm((p) => ({
                            ...p,
                            start_time: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>End Time</label>
                      <input
                        type="datetime-local"
                        value={showForm.end_time}
                        onChange={(e) =>
                          setShowForm((p) => ({
                            ...p,
                            end_time: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Ticket Price *</label>
                      <input
                        type="number"
                        placeholder="e.g., 250"
                        value={showForm.ticket_price}
                        onChange={(e) =>
                          setShowForm((p) => ({
                            ...p,
                            ticket_price: parseInt(e.target.value),
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={showForm.status}
                        onChange={(e) =>
                          setShowForm((p) => ({
                            ...p,
                            status: e.target.value,
                          }))
                        }
                      >
                        <option value="active">Active</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="modal-actions">
                      <button type="submit" className="btn-primary">
                        {editingShow ? "Update Show" : "Add Show"}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={closeShowModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <section className="bookings-section">
            <h2>Bookings & Revenue</h2>
            <div className="bookings-stats">
              <div className="stat-card">
                <h4>Total Bookings</h4>
                <p className="stat-value">0</p>
              </div>
              <div className="stat-card">
                <h4>Total Revenue</h4>
                <p className="stat-value">₹0</p>
              </div>
              <div className="stat-card">
                <h4>Seats Booked</h4>
                <p className="stat-value">0</p>
              </div>
              <div className="stat-card">
                <h4>Occupancy Rate</h4>
                <p className="stat-value">0%</p>
              </div>
            </div>
            <div className="empty-state">
              <p>No bookings yet.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ThaterDashboard;