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

const postRating = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { rating } = request.body;
    const reviewID = request.params.id;
    const { data, error } = await supabase.post("reviewrating", {
      reviewid: reviewID,
      rating,
    });

    if (error) {
      response.status(500).json({ error });
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
): Promise<void> => {
  try {
    const movieID = request.params.id;

    // Get all the reviews related to the movie
    const { data: reviews, error: reviewsError } = await supabase.get(
      `/review?movieid=eq.${movieID}`
    );

    if (reviewsError) {
      console.log(reviewsError.message);
      response.status(500).json({ error: reviewsError });
    }

    // Extract review IDs from the movie's reviews
    const reviewIDs = reviews.map((review: { id: number }) => review.id);

    if (reviewIDs.length === 0) {
      response
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

    response.status(200).json({ averageRating });
  } catch (error) {
    next(error);
  }
};
export { getRatingsByID, postRating, getAverageRatingByMovieID };
