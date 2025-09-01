const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Movies array
let movies = [
  { id: 1, title: 'Inception' },
  { id: 2, title: 'The Dark Knight' },
  { id: 3, title: 'Interstellar' }
];

// GET all movies
app.get('/api/movies', (req, res) => {
  res.json(movies);
});

// POST a new movie
app.post('/api/movies', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newMovie = {
    id: movies.length + 1,
    title
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Try GET: http://localhost:${port}/api/movies`);
  console.log(`Try POST (in Postman): http://localhost:${port}/api/movies`);
});
