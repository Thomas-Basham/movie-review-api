const axios = require("axios");
require("dotenv").config();
const supabase = require("./supabaseInstance");

// Function to search movies by genre and seed data into the database
async function seedMovies() {
  try {
    let page = 1;
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&primary_release_year=2024`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    if (data.Response === "False") {
      return;
    }
    console.log(data);

    for (const movie of data.results) {
      console.log(movie);
      const movieData = {
        title: movie.title,
        release_year: new Date(movie.release_date).getFullYear(),
        overview: movie.overview,
        TMDBid: movie.id,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
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
