import { Request, Response, NextFunction, Application } from "express";
import supabase from "../../supabaseInstance";

const getRatingsByID = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any | Response<any>> => {
  try {
    const reviewID = request.params.id;
    const { data, error } = await supabase.get(
      `/reviewrating?reviewid=eq.${reviewID}`
    );
    if (error) {
      console.log(error.message);
      return response.status(500).json({ error });
    }

    response.json(data);
  } catch (error) {
    next(error);
  }
};

const postRating = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any | Response<any>> => {
  try {
    const { rating } = request.body;
    const reviewID = request.params.id;
    const { data, error } = await supabase.post("reviewrating", {
      reviewid: reviewID,
      rating,
    });

    if (error) {
      return response.status(500).json({ error, message: error.message });
    }

    response.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const getAverageRatingByMovieID = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any | Response<any>> => {
  try {
    const movieID = request.params.id;

    // Get all the reviews related to the movie
    const { data: reviews, error: reviewsError } = await supabase.get(
      `/review?movieid=eq.${movieID}`
    );

    if (reviewsError) {
      console.log(reviewsError.message);
      return response.status(500).json({ error: reviewsError });
    }

    // Extract review IDs from the movie's reviews
    const reviewIDs = reviews.map((review: { id: number }) => review.id);

    if (reviewIDs.length === 0) {
    return  response
        .status(200)
        .json({ message: "No reviews found for this movie." });
    }

    // Get all ratings for the reviews related to the movie
    const { data: ratings, error: ratingsError } = await supabase.get(
      `/reviewrating?reviewid=in.(${reviewIDs.join(",")})`
    );

    if (ratingsError) {
      console.log(ratingsError.message);
      response.status(500).json({ error: ratingsError });
    }

    // Calculate the average rating
    const totalRating = ratings.reduce(
      (acc: number, rating: { rating: number }) => acc + rating.rating,
      0
    );
    const averageRating = totalRating / ratings.length;

    const amountOfRatings = ratings.length;

    response.status(200).json({ averageRating, amountOfRatings });
  } catch (error) {
    next(error);
  }
};
export { getRatingsByID, postRating, getAverageRatingByMovieID };
