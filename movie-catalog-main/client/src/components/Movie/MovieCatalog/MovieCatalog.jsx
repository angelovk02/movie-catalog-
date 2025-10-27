import React, { useState, useEffect } from "react";
import MovieCard from "../MovieCard/MovieCard";
import movieCatalogStyles from "./MovieCatalog.module.css";
import { db } from "../../../firebase"; // your Firebase config
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const MovieCatalog = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;

  useEffect(() => {
    fetchMoviesData();
  }, []);

  const fetchMoviesData = async () => {
    try {
      const moviesRef = collection(db, "movies");
      const q = query(moviesRef, orderBy("createdAt", "desc")); // order by creation date
      const querySnapshot = await getDocs(q);

      const moviesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMovies(moviesData);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const NoMoviesCard = () => (
    <div className={movieCatalogStyles.noMovieCard}>
      <h3>No movies available</h3>
    </div>
  );

  // Pagination
  const lastMovieIndex = currentPage * moviesPerPage;
  const firstMovieIndex = lastMovieIndex - moviesPerPage;
  const currentMovies = movies.slice(firstMovieIndex, lastMovieIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={movieCatalogStyles.movieCatalog}>
      <h2>Movie Catalog</h2>
      {movies.length === 0 ? (
        <div className={movieCatalogStyles.movieList}>
          <NoMoviesCard />
        </div>
      ) : (
        <>
          <div className={movieCatalogStyles.movieList}>
            {currentMovies.map((movie) => (
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

          <div className={movieCatalogStyles.pagination}>
            {[...Array(Math.ceil(movies.length / moviesPerPage))].map(
              (_, index) => (
                <button key={index} onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieCatalog;
