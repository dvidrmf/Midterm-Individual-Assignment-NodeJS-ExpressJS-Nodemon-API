const express = require('express');
const app = express();
const port = 4000;

// Movies data array
const movies = [
    { id: 1, title: 'The Dark Knight', genre: 'Action', year: 2008, rating: 9.0 },
    { id: 2, title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 8.8 },
    { id: 3, title: 'The Godfather', genre: 'Drama', year: 1972, rating: 9.2 },
    { id: 4, title: 'Pulp Fiction', genre: 'Crime', year: 1994, rating: 8.9 },
    { id: 5, title: 'The Matrix', genre: 'Sci-Fi', year: 1999, rating: 8.7 },
    { id: 6, title: 'Forrest Gump', genre: 'Drama', year: 1994, rating: 8.8 }
];

// Basic route
app.get('/', (req, res) => {
    res.send('Movies API Server - GET Requests Demo');
});

// GET all movies
app.get('/api/movies', (req, res) => {
    res.json({
        message: 'All movies retrieved successfully',
        count: movies.length,
        movies: movies
    });
});

// GET specific movie by ID
app.get('/api/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = movies.find(m => m.id === movieId);
    
    if (movie) {
        res.json({
            message: `Movie with ID ${movieId} found`,
            movie: movie
        });
    } else {
        res.status(404).json({
            message: `Movie with ID ${movieId} not found`,
            available_ids: movies.map(m => m.id)
        });
    }
});

// GET movies by genre (query parameter)
app.get('/api/movies/genre/:genre', (req, res) => {
    const genre = req.params.genre;
    const moviesByGenre = movies.filter(m => 
        m.genre.toLowerCase() === genre.toLowerCase()
    );
    
    res.json({
        message: `Movies in ${genre} genre`,
        count: moviesByGenre.length,
        movies: moviesByGenre
    });
});

// GET movies with query parameters (genre, year, rating)
app.get('/api/search/movies', (req, res) => {
    const { genre, year, minRating } = req.query;
    let filteredMovies = movies;
    
    if (genre) {
        filteredMovies = filteredMovies.filter(m => 
            m.genre.toLowerCase() === genre.toLowerCase()
        );
    }
    
    if (year) {
        filteredMovies = filteredMovies.filter(m => 
            m.year === parseInt(year)
        );
    }
    
    if (minRating) {
        filteredMovies = filteredMovies.filter(m => 
            m.rating >= parseFloat(minRating)
        );
    }
    
    res.json({
        message: 'Filtered movies',
        filters_applied: { genre, year, minRating },
        count: filteredMovies.length,
        movies: filteredMovies
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Movies API server running at http://localhost:${port}`);
    console.log(`Try visiting: http://localhost:${port}/api/movies`);
});

// Export for testing purposes
module.exports = app;