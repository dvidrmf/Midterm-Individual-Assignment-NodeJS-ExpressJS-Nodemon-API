const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World! Express REST API is running.');
});

// Heroes data array
const heroes = [
    { id: 1, name: 'Batman', universe: 'DC' },
    { id: 2, name: 'Superman', universe: 'DC' },
    { id: 3, name: 'Spider-Man', universe: 'Marvel' },
    { id: 4, name: 'Wonder Woman', universe: 'DC' },
    { id: 5, name: 'Iron Man', universe: 'Marvel' }
];

// API endpoint to get all heroes
app.get('/api/heroes', (req, res) => {
    res.json(heroes);
});

// Single route parameter - get hero by name/id
app.get('/api/heroes/:id', (req, res) => {
    const heroId = req.params.id;
    
    // If it's a number, find by id, otherwise find by name
    let hero;
    if (!isNaN(heroId)) {
        hero = heroes.find(h => h.id === parseInt(heroId));
    } else {
        hero = heroes.find(h => h.name.toLowerCase() === heroId.toLowerCase());
    }
    
    if (hero) {
        res.json({
            message: `Route parameter received: ${heroId}`,
            hero: hero
        });
    } else {
        res.status(404).json({
            message: `Route parameter received: ${heroId}`,
            error: 'Hero not found'
        });
    }
});

// Multi route parameters
app.get('/api/heroes/:name/:universe', (req, res) => {
    const { name, universe } = req.params;
    const hero = heroes.find(h => 
        h.name.toLowerCase() === name.toLowerCase() && 
        h.universe.toLowerCase() === universe.toLowerCase()
    );
    
    res.json({
        message: `Route parameters - Name: ${name}, Universe: ${universe}`,
        hero: hero || 'Hero not found'
    });
});

// Query parameters example
app.get('/api/search', (req, res) => {
    const { universe, limit } = req.query;
    let result = heroes;
    
    if (universe) {
        result = result.filter(h => h.universe.toLowerCase() === universe.toLowerCase());
    }
    
    if (limit) {
        result = result.slice(0, parseInt(limit));
    }
    
    res.json({
        query_parameters: req.query,
        results: result
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
    console.log(`Try visiting: http://localhost:${port}/api/heroes`);
});

// Export for testing purposes
module.exports = app;
