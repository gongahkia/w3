// ----------

// THE PROJECTOR SCRAPER

// - parses data from https://theprojector.sg/films
// - extracts the following
    // event-list-item-module--cover-image--1H3q2 > picture
    // event-list-item-module--title--1r-44
    // rating-module--rating--3GlKm 
    // event-list-item-module--blurb--1Mh9e
    // event-list-item-module--theme--3QO97

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

        function decodeHTMLEntity(encodedString) {
            const textarea = doc.createElement('textarea');
            textarea.innerHTML = encodedString;
            return textarea.value;
        }

        // -- debugging -- 
        // console.log(doc.title);
        // console.log(doc.body.innerHTML)
        // const mainBody = doc.querySelector('.event-list-module--events--3jC_9.event-list-module--grid--3HVrf');
        // console.log(mainBody.innerHTML);

        const projFilms = doc.querySelectorAll('.event-list-item-module--event-list-item--3aAfb.event-list-module--event-list-item--1YddO.undefined'); 
        console.log(`number of movies => ${projFilms.length}`);

        const projFilmsObject = [];

        if (projFilms.length) {
            projFilms.forEach(projFilm => {

                    // console.log(projFilm.innerHTML);

                    // event-list-item-module--cover-image--1H3q2 > picture
                    // event-list-item-module--categories--1-fI5
                    // event-list-item-module--title--1r-44
                    // rating-module--rating--3GlKm 
                    // event-list-item-module--blurb--1Mh9e
                    // event-list-item-module--theme--3QO97

                    const coverImageSrc = projFilm.querySelector('.event-list-item-module--cover-image--1H3q2 img')?.getAttribute('src') || 'N/A';
                    const title = projFilm.querySelector('.event-list-item-module--title--1r-44 a')?.innerHTML || 'N/A';
                    const rating = projFilm.querySelector('.rating-module--rating--3GlKm')?.innerHTML || 'N/A';
                    const rawBlurb = projFilm.querySelector('.event-list-item-module--blurb--1Mh9e')?.innerHTML || 'N/A';
                    const cleanBlurb = decodeHTMLEntity(rawBlurb)
                        ?.replace(/<\/?(b|em|strong|i|p)\b[^>]*>/gi, '') 
                        .replace(/<br\s*\/?>/gi, ' | ') 
                        .replace(/\s{2,}/g, ' ') 
                        .trim(); 
                    const theme = projFilm.querySelector('.event-list-item-module--theme--3QO97')?.innerHTML || 'N/A';

                    // console.log(`
                    //         -----
                    //         Title: ${title}
                    //         Description: ${cleanBlurb}
                    //         Rating: ${rating}
                    //         Theme: ${theme}
                    //         Poster src: ${coverImageSrc}
                    //         -----
                    //     `);

                    projFilmsObject.push({
                        title: title,
                        tags: theme,
                        description: cleanBlurb,
                        duration: null,
                        rating: rating,
                        bookTicketsUrl: "https://theprojector.sg/films",
                        posterSrc: coverImageSrc
                    });

            });
            return projFilmsObject;
        } else {
            console.log('Zero the projector films were found');
        }
    } else {
        console.log('HTML content not found');
    }
};

// ----- EXECUTION CODE -----
    // - for testing
    // - actual usage to be called from /src/main.js

// extractFilms("https://theprojector.sg/films").then((projFilmsObject) => {
//     if (projFilmsObject) {
//         console.log(JSON.stringify(projFilmsObject, null, 2));
//     } else {
//         console.log('no movies data were found');
//     }
// });