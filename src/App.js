import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  async function fetchMoviesHandler() {
    try {
      setisLoading(true);
      const response = await fetch("https://swapi.dev/api/films");
      //convert to json()
      const data = await response.json();

      // changing moviedata the way we want
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });

      //set movies to the new array.
      setMovies(transformedMovies);
      setisLoading(false);
    } catch (error) {
      console.log("Endpoint Error:", error);
    }
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && <MoviesList movies={movies} />}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
