import { Request, Response, NextFunction } from "express";
import supabase from "../../supabaseInstance";

const getRatingsByID = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const reviewID = request.params.id;
    const { data, error } = await supabase.get(
      `/reviewrating?reviewid=eq.${reviewID}`
    );
    if (error) {
      console.log(error.message);
      response.status(500).json({ error });
    }

    response.json(data);
  } catch (error) {
    next(error);
  }
};

export { getRatingsByID };
