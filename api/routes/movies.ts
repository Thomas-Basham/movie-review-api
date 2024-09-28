import { Request, Response, NextFunction } from "express";
import supabase from "../../supabaseInstance";

const getAllMovies = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await supabase.get("/movie");
    if (error) {
      response.status(500).json({ error });
    }

    response.json(data);
  } catch (error) {
    next(error);
  }
};

const addMovie = (request: Request, response: Response, next: NextFunction) => {
  const { title, release_year } = request.body;

  try {
    const { data, error } = supabase.post("movie", {
      title,
      release_year,
    });

    if (error) {
      response.status(500).json({ error });
    }

    response.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export { getAllMovies, addMovie };
