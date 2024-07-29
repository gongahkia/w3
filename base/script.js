// ----- EXECUTION CODE -----

document.addEventListener('DOMContentLoaded', () => {

// ----- FUNCTION DEFINITION -----

    async function fetchFilmData() {
        try {
            const response = await fetch('/api/films');
            const data = await response.json();
            document.getElementById('film-data').innerHTML = `
                <h2>Eagle Wings Cinematics</h2>
                <pre>${JSON.stringify(data.eagleWingsCinematicsArray, null, 2)}</pre>
                <h2>Golden Village</h2>
                <pre>${JSON.stringify(data.goldenVillageArray, null, 2)}</pre>
                <h2>The Projector</h2>
                <pre>${JSON.stringify(data.theProjectorArray, null, 2)}</pre>
                <h2>We Cinemas</h2>
                <pre>${JSON.stringify(data.weCinemasArray, null, 2)}</pre>
                <h2>Film Garde Cineplexes</h2>
                <pre>${JSON.stringify(data.filmGardeCineplexesArray, null, 2)}</pre>
            `;
        } catch (error) {
            console.error('Error fetching film data:', error);
            document.getElementById('film-data').innerHTML = 'Failed to load film data.';
        }
    }

// ----- EXECUTION CODE -----

    console.log("~ w3 testing base ~");
    fetchFilmData();

});
