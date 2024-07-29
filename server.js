// import dependancies
const express = require('express');
const path = require('path');
const { extractFilmsEwc } = require('./lib/eagleWingsCinematics.js');
const { extractFilmsGv } = require('./lib/goldenVillage.js');
const { extractFilmsTp } = require('./lib/theProjector.js');
const { extractFilmsWe } = require('./lib/weCinemas.js');
const { extractFilmsFgc } = require('./lib/filmgardeCineplexes.js');

// const declarations
const app = express();
const port = 3000;
const ewcUrl = "https://www.eaglewingscinematics.com.sg/movies#openModal";
const fgUrl = "https://fgcineplex.com.sg/movies";
const gvUrl = "https://www.gv.com.sg/GVMovies";
const tpUrl = "https://theprojector.sg/films";
const weUrl = `https://www.wecinemas.com.sg/buy-ticket.aspx?movieid=&date=${getCurrentDate()}`;

// helper function declaration

function getCurrentDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
}

// serves static files
app.use(express.static(path.join(__dirname, 'base')));

// specifies API route to fetch data 
app.get('/api/films', async (req, res) => {
    try {
        const ewcFilms = await extractFilmsEwc(ewcUrl);
        const gvFilms = await extractFilmsGv(gvUrl);
        const tpFilms = await extractFilmsTp(tpUrl);
        const weFilms = await extractFilmsWe(weUrl);
        const fgcFilms = await extractFilmsFgc(fgUrl);
        console.log("~ all films have been retrieved ~");
        res.json({
            eagleWingsCinematicsArray: ewcFilms,
            goldenVillageArray: gvFilms,
            theProjectorArray: tpFilms,
            weCinemasArray: weFilms,
            filmGardeCineplexesArray: fgcFilms,
        });
    } catch (error) {
        console.error('Error fetching films:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ----- EXECUTION CODE -----
    // serves the local server
    // hehe lol

app.listen(port, () => {
    console.log(`~ W3 server is now running at http://localhost:${port} ~`);
});