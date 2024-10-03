import { Request, Response, NextFunction } from "express";
import supabase from "../../supabaseInstance";

const getReviewsByID = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const movieID = request.params.id;
    const { data, error } = await supabase.get(`/review?movieid=eq.${movieID}`);
    if (error) {
      response.status(500).json({ error });
    }

    response.json(data);
  } catch (error) {
    next(error);
  }
};

const postReview = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content } = request.body;
    const movieID = request.params.id;
    const { data, error } = await supabase.post("review", {
      movieid: movieID,
      content,
      // timestamp: new Date().toISOString(),
    });

    if (error) {
      response.status(500).json({ error: error, message: error.message });
    }

    response.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
export { getReviewsByID, postReview };
