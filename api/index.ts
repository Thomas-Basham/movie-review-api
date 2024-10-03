// Import Dotenv
require("dotenv").config();

// Import Express
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

import supabase from "../supabaseInstance";

// Import CORS
const cors = require("cors");

// Import Axios
const axios = require("axios");

// Import our routes
import { getAllMovies, addMovie } from "./routes/movies";
import { getReviewsByID } from "./routes/reviews";
import { getRatingsByID } from "./routes/reviewRatings";

// create an express application
const app = express();

// define a port
const PORT = process.env.PORT;

// Define our Middleware
// Use CORS Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Use JSON middleware to parse request bodies
app.use(express.json());

// Define our Routes
// Home Route
app.get("/", (request: Request, response: Response, next: NextFunction) => {
  response.json({ message: "welcome to our server" });
});

// POST a movie
app.post("/movies", addMovie);

// GET ALL Movies
app.get("/movies", getAllMovies);

// GET al reviews for Movie
app.get("/movies/:id/reviews", getReviewsByID);

// GET al ratings for Review
app.get("/reviews/:id/ratings", getRatingsByID);

// Error Handling
// Generic Error Handling
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    console.error(error.stack);
    response.status(500).json({
      error: "Something broke!",
      errorStack: error.stack,
      errorMessage: error.message,
    });
  }
);

// 404 Resource not found Error Handling
app.use((request: Request, response: Response, next: NextFunction) => {
  response.status(404).json({
    error:
      "Resource not found. Are you sure you're looking in the right place?",
  });
});

// make the server listen on our port
const server = app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});

// export our app for testing
module.exports = app;
