import React, { useState, useEffect } from "react";
import MovieCard from '../Movie/MovieCard/MovieCard';
import { fetchMovies } from '../../services/movieService'; // updated service
import homeStyles from './Home.module.css';

const Home = () => {
  const [recentMovies, setRecentMovies] = useState([]);

  useEffect(() => {
    fetchRecentMovies();
  }, []);

  const fetchRecentMovies = async () => {
    try {
      const moviesData = await fetchMovies();

      // Sort by createdAt descending to get "recent" movies
      const sortedMovies = moviesData
        .filter((m) => m.createdAt) // ensure createdAt exists
        .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

      setRecentMovies(sortedMovies.slice(0, 5)); // top 5 recent movies
    } catch (error) {
      console.error('Error fetching recent movies:', error);
    }
  };

  return (
    <div className={homeStyles.home}>
      {recentMovies && recentMovies.length > 0 ? (
        <div className={homeStyles.recentMoviesContainer}>
          <h2>Recently Added Movies</h2>
          <div className={homeStyles.recentMoviesList}>
            {recentMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movieId={movie.id}
                title={movie.title}
                category={movie.category}
                director={movie.director}
                image={movie.image}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={homeStyles.noMoviesCard}>
          <h3>No recently added movies.</h3>
          <p>Check back later for updates!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
