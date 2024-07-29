import { extractFilmsEwc } from '../lib/eagleWingsCinematics.js';
// import { extractFilmsFgc } from '../lib/filmgardeCineplexes.js';
// import { extractFilmsGv } from '../lib/goldenVillage.js';
// import { extractFilmsTp } from '../lib/theProjector.js';
// import { extractFilmsWe } from '../lib/weCinemas.js';

async function extractAllFilms() {

    const ewcUrl = "https://www.eaglewingscinematics.com.sg/movies#openModal";
    // const fgUrl = "https://fgcineplex.com.sg/movies";
    // const gvUrl = "https://www.gv.com.sg/GVMovies";
    // const tpUrl = "https://theprojector.sg/films";
    // const weUrl = `https://www.wecinemas.com.sg/buy-ticket.aspx?movieid=&date=${getCurrentDate()}`;

    try {

        console.time("time to extract films");

        const [ewcFilms] = await Promise.all([
            extractFilmsEwc(ewcUrl),
        ]);

        // const [ewcFilms, fgcFilms, gvFilms, tpFilms, weFilms] = await Promise.all([
        //     extractFilmsEwc(ewcUrl),
        //     extractFilmsFgc(fgUrl),
        //     extractFilmsGv(gvUrl),
        //     extractFilmsTp(tpUrl),
        //     extractFilmsWe(weUrl)
        // ]);

        console.timeEnd("time to extract films");

        return {
            eagleWingsCinematicsArray: { ewcFilms },
        };

    } catch (error) {
        console.error('error reached extracting films:', error);
        throw error;
    }

}

function getCurrentDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
}

// ----- EXECUTION CODE -----

console.log("~ w3 testing base ~");
extractAllFilms();