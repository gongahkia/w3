// ----------

// EAGLE WINGS CINEMATICS SCRAPER

// - parses data from 
// - extracts the following
    // https://www.eaglewingscinematics.com.sg/movies#openModal

// - dependancy installation
    // npm install playwright
    //  npx playwright install

// ----------

const { chromium } = require('playwright');

async function fetchAndParseHTML(url) {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });
        let previousHeight;
        let currentHeight = await page.evaluate(() => document.body.scrollHeight);
        while (true) {
            previousHeight = currentHeight;
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(3000); // wait for content to load
            currentHeight = await page.evaluate(() => document.body.scrollHeight);
            if (currentHeight === previousHeight) break;
        }
        const content = await page.content();
        await browser.close();
        return content;
    } catch (error) {
        console.error('Error fetching HTML:', error);
    }
}

async function extractFilms(url) {
    const htmlText = await fetchAndParseHTML(url);
    if (htmlText) {
        const { JSDOM } = require('jsdom');
        const dom = new JSDOM(htmlText);
        const doc = dom.window.document;

        // -- debugging -- 

        // console.log(doc.title);
        // console.log(doc.body.innerHTML)

        const eagleWingsCinematicsFilms = doc.querySelectorAll('.movie-details');
        console.log(`number of movies => ${eagleWingsCinematicsFilms}`);

        const eagleWingsCinematicsFilmsObject = [];

        if (eagleWingsCinematicsFilms.length) {

            eagleWingsCinematicsFilms.forEach(ewcFilm => {

                const imageSrc = li.querySelector('img')?.getAttribute('src') || 'N/A';
                const title = gvFilm.querySelector('.details-title');
                const titleText = title ? title.textContent.trim() : 'N/A';
                const rating = gvFilm.querySelector('.details-rating');
                const ratingText = rating ? rating.textContent.trim() : 'N/A';
                const description = gvFilm.querySelector('.details-description');
                const descriptionText = description ? description.textContent.trim() : 'N/A';
                const bookTicketsUrl = gvFilm.querySelector('.details-book');
                const bookTicketsUrlText = bookTicketsUrl ? bookTicketsUrl.textContent.trim() : 'N/A';

                console.log(`
                        -----
                        Image src: ${imageSrc}
                        Title: ${titleText}
                        Description: ${descriptionText}
                        Rating : ${ratingText}
                        Book tickets Url: ${bookTicketsUrlText}
                        -----
                    `);

                eagleWingsCinematicsFilmsObject.push({
                    title: titleText,
                    description: descriptionText,
                    duration: null,
                    rating: ratingText,
                    bookTicketsUrl: bookTicketsUrlText,
                    posterSrc: imageSrc
                });

            })

        } else {
            console.log('No eaglewings cinematics films found');
        }
    } else {
        console.log('HTML content not found');
    }
};

// ----- EXECUTION CODE -----
    // - for testing
    // - actual usage to be called from /src/main.js

extractFilms("https://www.eaglewingscinematics.com.sg/movies#openModal");

// extractFilms("https://www.gv.com.sg/GVMovies").then((gvFilmsObject) => {
//     if (gvFilmsObject) {
//         console.log(JSON.stringify(gvFilmsObject, null, 2));
//     } else {
//         console.log('no movies data were found');
//     }
// });