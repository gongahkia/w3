// document.addEventListener('DOMContentLoaded', () => {

//     // ----- FUNCTION DEFINITION -----

//     async function fetchFilmData() {
//         try {
//             const response = await fetch('/api/films');
//             const data = await response.json();

//             // Function to format and display film data
//             function formatFilmData(filmsArray, title) {
//                 return `
//                     <h2>${title}</h2>
//                     ${filmsArray.map(film => `
//                         <div class="film-card">
//                             <h3>${film.title}</h3>
//                             <img src="${film.posterSrc}" alt="${film.title}" class="film-poster" />
//                             <p><strong>Description:</strong> ${film.description}</p>
//                             <p><strong>Rating:</strong> ${film.rating}</p>
//                             <p><strong>Tags:</strong> ${film.tags ? film.tags : 'N/A'}</p>
//                             <p><strong>Duration:</strong> ${film.duration ? film.duration : 'N/A'}</p>
//                             <a href="${film.bookTicketsUrl}" target="_blank">Book Tickets</a>
//                         </div>
//                     `).join('')}
//                 `;
//             }

//             document.getElementById('film-data').innerHTML = `
//                 ${formatFilmData(data.eagleWingsCinematicsArray, 'Eagle Wings Cinematics')}
//                 ${formatFilmData(data.goldenVillageArray, 'Golden Village')}
//                 ${formatFilmData(data.theProjectorArray, 'The Projector')}
//                 ${formatFilmData(data.weCinemasArray, 'We Cinemas')}
//                 ${formatFilmData(data.filmGardeCineplexesArray, 'Film Garde Cineplexes')}
//             `;
//         } catch (error) {
//             console.error('Error fetching film data:', error);
//             document.getElementById('film-data').innerHTML = 'Failed to load film data.';
//         }
//     }

//     // ----- EXECUTION CODE -----

//     console.log("~ w3 testing base ~");
//     fetchFilmData();

// });


document.addEventListener('DOMContentLoaded', () => {

    // ----- FUNCTION DEFINITION -----

    async function fetchFilmData() {
        try {
            const response = await fetch('/api/films');
            const data = await response.json();

            // Function to format and display film data
            function formatFilmData(filmsArray, title) {
                return `
                    <h2>${title}</h2>
                    ${filmsArray.map(film => `
                        <div class="film-card">
                            <h3>${film.title}</h3>
                            <img src="${film.posterSrc}" alt="${film.title}" class="film-poster" />
                            <p><strong>Description:</strong> ${film.description}</p>
                            <p><strong>Rating:</strong> ${film.rating}</p>
                            <p><strong>Tags:</strong> ${film.tags ? film.tags : 'N/A'}</p>
                            <p><strong>Duration:</strong> ${film.duration ? film.duration : 'N/A'}</p>
                            <a href="${film.bookTicketsUrl}" target="_blank">Book Tickets</a>
                        </div>
                    `).join('')}
                `;
            }

            document.getElementById('film-data').innerHTML = `
                ${formatFilmData(data.eagleWingsCinematicsArray, 'EagleWings Cinematics')}
                ${formatFilmData(data.goldenVillageArray, 'Golden Village')}
                ${formatFilmData(data.theProjectorArray, 'The Projector')}
                ${formatFilmData(data.weCinemasArray, 'WE Cinemas')}
                ${formatFilmData(data.filmGardeCineplexesArray, 'Filmgarde Cineplexes')}
            `;
        } catch (error) {
            console.error('Error fetching film data:', error);
            document.getElementById('film-data').innerHTML = 'Failed to load film data.<br><input type="reset" value="reload page">';
        }
    }

    // ----- EXECUTION CODE -----

    console.log("~ w3 testing base ~");
    fetchFilmData();

});
