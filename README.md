# Movie Review App

This is a **Movie Review API** built using **Express**, **TypeScript**, and the **Supabase REST API**. The API allows users to manage movies, add reviews for movies, and rate the reviews. It demonstrates full CRUD operations and uses Supabase for database storage and relationship management between movies, reviews, and ratings.

## Features

- **Movies**: Add, view, and delete movies.
- **Reviews**: Add and view reviews for specific movies.
- **Review Ratings**: Rate reviews on a scale of 1 to 5.

## Tech Stack

- **Backend**: Express with TypeScript
- **Database**: Supabase (PostgreSQL via Supabase REST API)
- **HTTP Requests**: Axios (for interacting with Supabase REST API)
- **Environment Management**: dotenv

## Database Schema

### Tables

1. **Movie**: Stores information about movies (id, title, release year).
2. **Review**: Stores user reviews for movies, with a foreign key to the Movie table.
3. **ReviewRating**: Stores ratings for reviews, with a foreign key to the Review table.

### SQL Schema

```sql
CREATE TABLE
  public.movie (
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    title TEXT NOT NULL,
    release_year INTEGER NOT NULL,
    poster_path TEXT NULL DEFAULT ''::TEXT,
    overview TEXT NULL DEFAULT ''::TEXT,
    backdrop_path TEXT NULL DEFAULT ''::TEXT,
    "TMDBid" BIGINT NULL,
    CONSTRAINT movie_pkey PRIMARY KEY (id)
  ) TABLESPACE pg_default;

CREATE TABLE
  public.review (
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    movieid BIGINT NULL,
    CONTENT TEXT NOT NULL,
    TIMESTAMP TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT review_pkey PRIMARY KEY (id),
    CONSTRAINT review_movieid_fkey FOREIGN KEY (movieid) REFERENCES movie (id) ON DELETE CASCADE
  ) TABLESPACE pg_default;

CREATE TABLE
  public.reviewrating (
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    reviewid BIGINT NULL,
    rating REAL NULL,
    CONSTRAINT reviewrating_pkey PRIMARY KEY (id),
    CONSTRAINT reviewrating_reviewid_fkey FOREIGN KEY (reviewid) REFERENCES review (id) ON DELETE CASCADE,
    CONSTRAINT reviewrating_rating_check CHECK (
      (
        (rating >= (1)::DOUBLE PRECISION)
        AND (rating <= (5)::DOUBLE PRECISION)
      )
    )
  ) TABLESPACE pg_default;
```

## API Endpoints

### 1. Movies

- **POST /movies**: Add a new movie.

  - **Request Body**:
    ```json
    {
      "title": "Inception",
      "release_year": 2010
    }
    ```
  - **Response**: Returns the newly created movie.

- **GET /movies**: Retrieve a list of all movies.
  - **Response**: A list of movies.
- **DELETE /movies/:id**: Delete a specific movie by its ID.
  - **Response**: Confirmation of deletion.

### 2. Reviews

- **POST /movies/:id/reviews**: Add a review to a specific movie.

  - **Request Body**:
    ```json
    {
      "content": "Great movie with an incredible plot twist!"
    }
    ```
  - **Response**: Returns the newly created review for the movie.

- **GET /movies/:id/reviews**: Retrieve all reviews for a specific movie.
  - **Response**: A list of reviews for the given movie.

### 3. Review Ratings

- **POST /reviews/:id/rate**: Add a rating to a review.
  - **Request Body**:
    ```json
    {
      "rating": 5
    }
    ```
  - **Response**: Returns the rating added for the review.

## Project Setup

### Prerequisites

- **Node.js** and **npm** installed
- A **Supabase account** and project set up (with your Supabase API keys)
- A **Supabase database** with the schema defined above

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/movie-review-app.git
   cd movie-review-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file at the root of the project with the following content:

   ```bash
   SUPABASE_URL=https://your-supabase-url
   SUPABASE_KEY=your-supabase-api-key
   PORT=4000
   ```

4. Create a `tsconfig.json` file at the root of the project:

   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "commonjs",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "outDir": "./dist"
     },
     "include": ["api/**/*"]
   }
   ```

5. Run the development server:
   ```bash
   npm start
   ```

### Folder Structure

```
movie-review-app/
│
├── api/
│   ├── routes/              # API route definitions
│   │   ├── movies.ts        # Movie routes
│   │   ├── reviews.ts       # Review routes
│   │   ├── ratings.ts       # Rating routes
│   └── index.ts             # Express app setup
├── supabase.ts              # Supabase connection logic using Axios
├── types.ts                 # TypeScript type definitions
├── .env                     # Environment variables (not committed to Git)
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

### Supabase Setup

1. Go to https://supabase.com and create a new project.
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Run the schema SQL commands provided above to create the tables (`Movie`, `Review`, `ReviewRating`).
4. Copy your **Supabase URL** and **API Key** from the Supabase project settings and add them to your `.env` file.

### API Example Usage

- **Adding a Movie**:

  ```bash
  curl -X POST http://localhost:4000/movies \
  -H "Content-Type: application/json" \
  -d '{"title": "Inception", "release_year": 2010}'
  ```

- **Adding a Review for a Movie**:

  ```bash
  curl -X POST http://localhost:4000/movies/1/reviews \
  -H "Content-Type: application/json" \
  -d '{"content": "Amazing movie!"}'
  ```

- **Rating a Review**:
  ```bash
  curl -X POST http://localhost:4000/reviews/1/rate \
  -H "Content-Type: application/json" \
  -d '{"rating": 5}'
  ```

## Error Handling

- Handles errors such as missing resources or invalid input with proper HTTP status codes (e.g., `404` for not found, `400` for bad requests).
- Provides meaningful error messages for easier debugging.

## Future Improvements

- Add authentication to the API using JWT.
- Implement pagination for large movie and review lists.
- Add caching for popular movie and review requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This should now match the structure you're planning to use, with the **`api`** folder containing the routes and no **`src`** folder. Let me know if you need any further adjustments!
