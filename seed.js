const axios = require("axios");
require("dotenv").config();
const supabase = require("./supabaseInstance");

// Function to search movies by genre and seed data into the database
async function seedMovies() {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=4&sort_by=popularity.desc`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.IMDB_API_KEY}`,
        },
      }
    );

    if (data.Response === "False") {
      return;
    }
    console.log(data);

    const movieDataList = [];

    // Loop through the search results and fetch full details for each movie
    for (const movie of data.results) {
      // const { data: movieDetails } = await axios.get(
      //   `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`
      // );
      console.log(movie);
      const movieData = {
        title: movie.title,
        release_year: new Date(movie.release_date).getFullYear(),
        // genre: movieDetails.Genre,
        // director: movieDetails.Director,
        // actors: movieDetails.Actors,
        // plot: movieDetails.Plot,
        // poster: movieDetails.Poster,
        // imdb_rating: movieDetails.imdbRating,
      };
      console.log(movieData);
      const { data, error } = supabase.post("movie", movieData);

      if (error) {
        console.log({ error });
      }
    }
  } catch (error) {
    console.error("Error seeding movie data:", error);
  }
}

seedMovies();
