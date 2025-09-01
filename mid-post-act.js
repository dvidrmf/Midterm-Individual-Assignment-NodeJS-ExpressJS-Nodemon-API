const express = require('express');
const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Movies data array
let movies = [
    { id: 1, title: 'The Dark Knight', genre: 'Action', year: 2008, rating: 9.0 },
    { id: 2, title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 8.8 },
    { id: 3, title: 'The Godfather', genre: 'Drama', year: 1972, rating: 9.2 }
];

// Helper function to get next ID
function getNextId() {
    return Math.max(...movies.map(m => m.id)) + 1;
}

// Basic route
app.get('/', (req, res) => {
    res.send('Movies API Server - POST Requests Demo');
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
            message: `Movie with ID ${movieId} not found`
        });
    }
});

// POST - Add a new movie
app.post('/api/movies', (req, res) => {
    // Validation
    if (!req.body.title) {
        return res.status(400).json({
            error: 'Title is required',
            required_fields: ['title'],
            optional_fields: ['genre', 'year', 'rating']
        });
    }
    
    // Check if movie already exists
    const existingMovie = movies.find(m => 
        m.title.toLowerCase() === req.body.title.toLowerCase()
    );
    
    if (existingMovie) {
        return res.status(409).json({
            error: 'Movie already exists',
            existing_movie: existingMovie
        });
    }
    
    // Create new movie
    const newMovie = {
        id: getNextId(),
        title: req.body.title,
        genre: req.body.genre || 'Unknown',
        year: req.body.year || new Date().getFullYear(),
        rating: req.body.rating || 0.0
    };
    
    // Add to movies array
    movies.push(newMovie);
    
    // Return success response
    res.status(201).json({
        message: 'Movie added successfully',
        movie: newMovie,
        total_movies: movies.length
    });
});

// POST - Add multiple movies
app.post('/api/movies/bulk', (req, res) => {
    if (!Array.isArray(req.body) || req.body.length === 0) {
        return res.status(400).json({
            error: 'Request body must be an array of movies'
        });
    }
    
    const addedMovies = [];
    const errors = [];
    
    req.body.forEach((movieData, index) => {
        if (!movieData.title) {
            errors.push({
                index: index,
                error: 'Title is required',
                data: movieData
            });
            return;
        }
        
        const existingMovie = movies.find(m => 
            m.title.toLowerCase() === movieData.title.toLowerCase()
        );
        
        if (existingMovie) {
            errors.push({
                index: index,
                error: 'Movie already exists',
                data: movieData
            });
            return;
        }
        
        const newMovie = {
            id: getNextId(),
            title: movieData.title,
            genre: movieData.genre || 'Unknown',
            year: movieData.year || new Date().getFullYear(),
            rating: movieData.rating || 0.0
        };
        
        movies.push(newMovie);
        addedMovies.push(newMovie);
    });
    
    res.status(201).json({
        message: `${addedMovies.length} movies added successfully`,
        added_movies: addedMovies,
        errors: errors,
        total_movies: movies.length
    });
});

// PUT - Update a movie
app.put('/api/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === movieId);
    
    if (movieIndex === -1) {
        return res.status(404).json({
            error: `Movie with ID ${movieId} not found`
        });
    }
    
    // Update movie
    const updatedMovie = {
        ...movies[movieIndex],
        ...req.body,
        id: movieId // Ensure ID doesn't change
    };
    
    movies[movieIndex] = updatedMovie;
    
    res.json({
        message: 'Movie updated successfully',
        movie: updatedMovie
    });
});

// DELETE - Remove a movie
app.delete('/api/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === movieId);
    
    if (movieIndex === -1) {
        return res.status(404).json({
            error: `Movie with ID ${movieId} not found`
        });
    }
    
    const deletedMovie = movies.splice(movieIndex, 1)[0];
    
    res.json({
        message: 'Movie deleted successfully',
        deleted_movie: deletedMovie,
        remaining_movies: movies.length
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Movies POST API server running at http://localhost:${port}`);
    console.log(`Try POST requests to: http://localhost:${port}/api/movies`);
    console.log('\nExample POST request body:');
    console.log(JSON.stringify({
        title: "Avengers: Endgame",
        genre: "Action",
        year: 2019,
        rating: 8.4
    }, null, 2));
});

// Export for testing purposes
module.exports = app;