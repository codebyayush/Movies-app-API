import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import Form from "./components/form/Form";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [cancelClick, setCancelClick] = useState(false);

  const fetchMoviesHandler = useCallback(async () => {
    setisLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://react-http-project-92df1-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        throw Error("Something went wrong... Retrying");
      }

      const data = await response.json();

      const loadedMovies = [];

      for (let key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });

        setMovies(loadedMovies);
      }

      setisLoading(false);
      clearInterval(intervalId);
      setIntervalId(null);
    } catch (error) {
      setError(error.message);
      setisLoading(false);
    }
    setisLoading(false);
  }, [intervalId]);

  const addMovieHandler = async (newMovie) => {
    const response = await fetch(
      "https://react-http-project-92df1-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(newMovie),
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = response.json();
    const loadedMovies = [];

    for (let key in data) {
      loadedMovies.push({
        id: key,
        title: data[key].title,
        openingText: data[key].openingText,
        releaseDate: data[key].releaseDate,
      });

      setMovies(loadedMovies);
    }
  };

  const deleteMovieHandler = async (id) => {
    const resp = await fetch(
      `https://react-http-project-92df1-default-rtdb.firebaseio.com/movies/${id}.json`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (resp.ok) {
      setMovies((prevMovies) => {
        let updatedList = prevMovies.filter((movies) => movies.id !== id);
        return updatedList;
      });
      fetchMoviesHandler();
    } else {
      console.log(resp);
    }
  };

  const startRetryInterval = useCallback(() => {
    setCancelClick(false);
    clearInterval(intervalId);
    const id = setInterval(fetchMoviesHandler, 5000);
    setIntervalId(id);
  }, [intervalId, fetchMoviesHandler]);

  const cancelHandler = useCallback(() => {
    clearInterval(intervalId);
    setIntervalId(null);
    setisLoading(false);
    setCancelClick(true);
  }, [intervalId]);

  useEffect(() => {
    fetchMoviesHandler();
  }, []);

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <React.Fragment>
      <Form newObj={addMovieHandler} />
      <section>
        <button onClick={startRetryInterval}>Fetch Movies</button>&nbsp;
        <button onClick={cancelHandler}>Cancel</button>
      </section>
      <section>
        {cancelClick ? (
          <p>cancelled</p>
        ) : (
          <>
            {!isLoading && movies.length > 0 && (
              <MoviesList movies={movies} deleteMovie={deleteMovieHandler} />
            )}
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
