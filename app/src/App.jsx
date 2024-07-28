import React, { useEffect, useState } from 'react';
import { extractAllFilms } from '../main.js';

const App = () => {
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const filmsData = await extractAllFilms();
                console.log(filmsData);
            } catch (error) {
                console.error('Error fetching films:', error);
            }
        };
        fetchMovies();
    }, []); 

    return (
        <p>So we watch what?</p>
    );
};

export default App;