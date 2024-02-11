import React, { useState, useEffect } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [cancelClick, setCancelClick] = useState(false);

  async function fetchMoviesHandler() {
    setisLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/films");

      if (!response.ok) {
        throw Error("Something went wrong... Retrying");
      }

      // Convert to json()
      const data = await response.json();

      // Changing movie data the way we want
      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));

      setMovies(transformedMovies);
      setisLoading(false);
      clearInterval(intervalId);
      setIntervalId(null);
    } catch (error) {
      setError(error.message);
      setisLoading(false);
    }
    setisLoading(false);
  }

  const startRetryInterval = () => {
    setCancelClick(false);
    clearInterval(intervalId);
    const id = setInterval(fetchMoviesHandler, 5000);
    setIntervalId(id);
  };

  const cancelHandler = () => {
    clearInterval(intervalId);
    setIntervalId(null);
    setisLoading(false);
    setCancelClick(true);
  };

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <React.Fragment>
      <section>
        <button onClick={startRetryInterval}>Fetch Movies</button>&nbsp;
        <button onClick={cancelHandler}>Cancel</button>
      </section>
      <section>
        {cancelClick ? (
          <p>cancelled</p>
        ) : (
          <>
            {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
            {!isLoading && movies.length === 0 && !error && (
              <p>Found no movies</p>
            )}
            {isLoading && <p>Loading...</p>}
            {!isLoading && error && <p>{error}</p>}
          </>
        )}
      </section>
    </React.Fragment>
  );
}

export default App;
