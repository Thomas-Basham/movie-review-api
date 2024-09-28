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

export { getReviewsByID };
