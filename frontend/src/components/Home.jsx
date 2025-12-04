import API from "../config/api";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [movies, setMovies] = React.useState([]);
  const nav = useNavigate();

  React.useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await API.get("/movie");
      console.log("Fetched movies:", res.data);
      setMovies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  const handleBookNow = (movieId) => {
    nav(`/movie/${movieId}`);
    console.log("movie id",movieId);
  };

  return (
    <div className="">
      <div 
      className="flex items-center pl-5 min-h-[700px] bg-cover " 
      style={{ backgroundImage: 'url(https://m.media-amazon.com/images/S/pv-target-images/d8b6923f357d37e3b9ee5cab6fc90ef6b7c2d0638b77ace11c274274eaffa109._SX1080_FMjpg_.jpg)' }}
    >
      <div className=" bg-opacity-60 "></div>
      <div className="">
        <div className="max-w-xl ">
          <h1 className="mb-5 text-6xl font-sans font-bold">Tron: Ares</h1>
          <p className="mb-5">Get ready for the electrifying action and adventure of Tron: Ares. When a highly sophisticated Program named Ares is sent from the digital world into the real world on a dangerous mission, it marks humankind first encounter with A.I. beings. Warning: Some flashing-lights scenes in this film may affect photosensitive viewers.</p>
          <button className="btn btn-primary">Book Now</button>
        </div>
      </div>
    </div>

      <div className="flex flex-wrap ">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className=" hover-3d  rounded-2xl card bg-base-100 w-90 p-10 border-2 m-1.5  shadow-sm"
          >
            <figure>
              <img
                src={
                  movie.poster_url ||
                  "https://m.media-amazon.com/images/M/MV5BOTYwYzYxMWYtZmI4MS00ZGRhLWEyMGEtZTdiODc3YjAyNDE0XkEyXkFqcGc@._V1_SX300.jpg"
                }
                alt={movie.title}
                className="w-60 rounded-2xl"
                onError={(e) =>
                  (e.currentTarget.src = "/placeholder-movie.png")
                }
              />
            </figure>
                
            <div className="card-body flex items-center justify-center">
              <h2 className="card-title">{movie.title}</h2>
              <p>{movie.description}</p>
              <div className="card-actions justify-center">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleBookNow(movie.id)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
