// ----------

// EAGLE WINGS CINEMATICS SCRAPER

// - parses data from https://www.eaglewingscinematics.com.sg/movies#openModal
// - extracts the following
    // img src
    // details-title
    // details-rating
    // details-description
    // details-book

// - dependancy installation
    // npm install playwright
    //  npx playwright install

// ----- NODEJS SPECIFIC -----

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

// ----- BROWSER SPECIFIC -----
    // archived

// async function fetchAndParseHTML() {
//     function scrollToBottom() {
//         window.scrollTo(0, document.body.scrollHeight);
//     }
//     function getHTML() {
//         return document.documentElement.outerHTML;
//     }
//     function sleep(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }
//     async function waitForPageLoad() {
//         let lastScrollHeight = document.body.scrollHeight;
//         let currentScrollHeight = lastScrollHeight;
//         let stableScroll = false;
//         while (!stableScroll) {
//             scrollToBottom();
//             await sleep(3000); 
//             currentScrollHeight = document.body.scrollHeight;
//             if (currentScrollHeight === lastScrollHeight) {
//                 stableScroll = true; 
//             } else {
//                 lastScrollHeight = currentScrollHeight;
//             }
//         }
//     }
//     await waitForPageLoad();
//     const htmlContent = getHTML();
//     console.log('Page HTML:', htmlContent);
//     return htmlContent;
// }

async function extractFilmsEwc(url) {
    const htmlText = await fetchAndParseHTML(url);
    if (htmlText) {
        const { JSDOM } = require('jsdom');
        const dom = new JSDOM(htmlText);
        const doc = dom.window.document;

        // -- debugging -- 

        // console.log(doc.title);
        // console.log(doc.body.innerHTML)

        const eagleWingsCinematicsFilms = doc.querySelectorAll('.movie-list > li');
        let numMovies = 0;

        const eagleWingsCinematicsFilmsObject = [];

        if (eagleWingsCinematicsFilms) {

            eagleWingsCinematicsFilms.forEach(ewcFilm => {

                const imageSrc = ewcFilm.querySelector('img')?.getAttribute('src') || 'N/A';
                const title = ewcFilm.querySelector('.details-title');
                const titleText = title ? title.textContent.trim() : 'N/A';
                const rating = ewcFilm.querySelector('[class^="details-rating"]');
                const ratingText = rating ? rating.textContent.trim() : 'N/A';
                const description = ewcFilm.querySelector('.details-description');
                const descriptionText = description ? description.textContent.trim() : 'N/A';
                const bookTicketsUrl = ewcFilm.querySelector('.details-book')?.getAttribute('href') || 'N/A';
                const bookTicketsUrlText = bookTicketsUrl.trim() || 'N/A';

                // console.log(`
                //         -----
                //         Image src: ${imageSrc}
                //         Title: ${titleText}
                //         Description: ${descriptionText}
                //         Rating : ${ratingText}
                //         Book tickets Url: ${bookTicketsUrlText}
                //         -----
                //     `);

                eagleWingsCinematicsFilmsObject.push({
                    title: titleText,
                    tags: null,
                    description: descriptionText,
                    duration: null,
                    rating: ratingText,
                    bookTicketsUrl: bookTicketsUrlText,
                    posterSrc: imageSrc
                });

                numMovies++;

            })

            console.log(`number of ewc movies => ${numMovies}`);

            return eagleWingsCinematicsFilmsObject;

        } else {
            console.log('No eaglewings cinematics films found');
        }
    } else {
        console.log('HTML content not found');
    }
};

module.exports = { extractFilmsEwc };

// ----- EXECUTION CODE -----
    // - for testing
    // - actual usage to be called from /src/main.js

// extractFilmsEwc("https://www.eaglewingscinematics.com.sg/movies#openModal").then((ewcFilmsObject) => {
//     if (ewcFilmsObject) {
//         console.log(JSON.stringify(ewcFilmsObject, null, 2));
//     } else {
//         console.log('no movies data were found');
//     }
// });
