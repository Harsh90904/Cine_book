import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../config/api";
import "../styles/movieDetails.css";

const MovieDetails = () => {
  const { movieId } = useParams();
  const { thaterid} = useParams()
  const nav = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("MovieDetails - movieId from route:", movieId);
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Fetching movie from: /movie/${movieId}");
      const res = await API.get(`/movie/${movieId}`);
      console.log("Movie data:", res.data);
      setMovie(res.data);
      
      // fetch shows after movie is loaded
      await fetchShowsByMovie();
      await fratchShowaByThater();
    } catch (err) {
      console.error("Fetch Movie Error:", err);
      setError(err?.response?.data?.message || "Failed to load movie details");
    } finally {
      setLoading(false);
    }
  };
  const fratchShowaByThater = async () => {
    try {
      console.log("Fetching shows from: /show/movie/${movieId}");
      const res = await API.get(`/show//thater/${thaterid}`);
      console.log("Shows response:", res.data);
      
      if (Array.isArray(res.data)) {
        setShows(res.data);
        console.log("Show ", res.data)
      } else if (res.data.shows) {
        setShows(res.data.shows);
      } else {
        setShows([]);
      }
    } catch (err) {
      console.error("Failed to fetch shows:", err?.response?.status, err?.response?.data);
      // Don't set error here — shows section can be empty
    }
  }
  const fetchShowsByMovie = async () => {
    try {
      console.log("Fetching shows from: /show/movie/${movieId}");
      const res = await API.get(`/show/movie/${movieId}`);
      console.log("Shows response:", res.data);
      
      if (Array.isArray(res.data)) {
        setShows(res.data);
        console.log("Show ", res.data)
      } else if (res.data.shows) {
        setShows(res.data.shows);
      } else {
        setShows([]);
      }
    } catch (err) {
      console.error("Failed to fetch shows:", err?.response?.status, err?.response?.data);
      // Don't set error here — shows section can be empty
    }
  };

  const handleSelectShow = (show) => {
    localStorage.setItem("selectedShow", JSON.stringify(show));
    localStorage.setItem("selectedMovie", JSON.stringify(movie));
    nav(`/booking/${show.id}`);
  };

  const handleGoBack = () => {
    nav(-1);
  };

  if (loading) {
    return <div className="loading-screen">Loading movie details...</div>;
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>{error}</p>
        <button onClick={handleGoBack} className="btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-screen">
        <p>Movie not found</p>
        <button onClick={handleGoBack} className="btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  // Group shows by theater
  const showsByTheater = shows.reduce((acc, show) => {
    const theaterId = show.theater_id || show.theater?.id;
    if (!theaterId) return acc;
    
    if (!acc[theaterId]) {
      acc[theaterId] = {
        theater: show.theater,
        shows: [],
      };
    }
    acc[theaterId].shows.push(show);
    return acc;
  }, {});

  return (
    <div className="movie-details-page">
      {/* Header */}
      <header className="movie-header">
        <button onClick={handleGoBack} className="back-btn">
          ← Back
        </button>
        <h1>Movie Details</h1>
      </header>

      {/* Hero Banner */}
      <div className="movie-banner">
        <div
          className="banner-bg"
          style={{
            backgroundImage: `url(${movie.poster_url || "/placeholder-movie.png"})`,
          }}
        >
          <div className="banner-overlay"></div>
        </div>

        {/* Movie Info Card */}
        <div className="movie-info-card">
          <div className="movie-poster">
            <img
              src={movie.poster_url || "/placeholder-movie.png"}
              alt={movie.title}
              onError={(e) => (e.currentTarget.src = "/placeholder-movie.png")}
            />
          </div>

          <div className="movie-meta">
            <h1>{movie.title}</h1>
            <div className="meta-row">
              <span className="badge">{movie.genre || "N/A"}</span>
              <span className="rating">
                ⭐ {movie.rating || movie.imdbRating || "N/A"}
              </span>
            </div>
            <div className="duration">
              ⏱️ {movie.duration ? `${movie.duration} minutes` : "N/A"}
            </div>
            <p className="description">{movie.description || movie.Plot || "No description available"}</p>
            {movie.language && <p className="language">🌐 {movie.language}</p>}
            {movie.Director && <p className="Director">🎬 Director: {movie.Director}</p>}
            {movie.Actors && <p className="Actors">👥 Cast: {movie.Actors}</p>}
            {movie.Country && <p className="Country">🌍 {movie.Country}</p>}
            <div className="release-date">
              📅 Release: {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Shows Section */}
      <section className="shows-section">
        <h2>Select Theater & Show Time</h2>

        {shows.length === 0 ? (
          <div className="no-shows text-black">
            <p>🎬 No shows available for this movie at the moment</p>
            <button onClick={handleGoBack} className="btn-primary">
              Browse Other Movies
            </button>
          </div>
        ) : (
          <div className="theaters-list">
            {Object.entries(showsByTheater).map(([theaterId, { theater, shows: theaterShows },]) => (
              <div key={theaterId} className="theater-block">
                <h3 className="theater-name">
                  🎭 {theater?.name || "Theater"}
                </h3>
                <p className="theater-location">
                  📍 {theater?.city}, {theater?.state}
                </p>

                <div className="shows-grid">
                  {theaterShows
                    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                    .map((show) => (
                      <div key={show.id} className="show-card">
                        <div className="show-time">
                          {new Date(show.start_time).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="show-type">{show.screen?.type || "2D"}</div>
                        <div className="show-price">₹{show.ticket_price}</div>
                        <button
                          className="btn-book"
                          onClick={() => handleSelectShow(show)}
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MovieDetails;