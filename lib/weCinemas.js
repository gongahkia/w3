// ----------

// WE CINEMAS SCRAPER

// - parses data from https://www.wecinemas.com.sg/buy-ticket.aspx?movieid=&date=07/24/2024
    // date is in the format of MM/DD/YYYY

// - extracts the following
    // h3
    // content-common-txt
    // showtimes-but a

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

async function extractFilmsWe(url) {

    const htmlText = await fetchAndParseHTML(url);

    if (htmlText) {
        const { JSDOM } = require('jsdom');
        const dom = new JSDOM(htmlText);
        const doc = dom.window.document;

        // -- debugging -- 
        // console.log(doc.title);
        // console.log(doc.body.innerHTML)

        const weFilms = doc.querySelector('#DataListCinemas_DataListDate_0_DataListMovietitle_0 tbody');

        function decodeHTMLEntity(encodedString) {
            const textarea = doc.createElement('textarea');
            textarea.innerHTML = encodedString;
            return textarea.value;
        }

        function extractDetails(details) {
            return details.split(",").map(el => el.trim())
        }

        const weFilmsObject = [];

        if (weFilms){

            const titleArray = Array.from(weFilms.querySelectorAll('h3 a')).map(el => decodeHTMLEntity(el.innerHTML)) || ['N/A'];
            const rawArray = Array.from(weFilms.querySelectorAll('.content-common-txt')).map(el => el.innerHTML) || ['N/A'];

            // console.log(titleArray);
            // console.log(rawArray);

            // const bookingObjectArray = Array.from(weFilms.querySelectorAll('.showtimes-but a')).map(el => ({
            //     text: el.innerHTML,
            //     href: el.href
            // })) || ['N/A'];
            // console.log(bookingObjectArray);

            for (let i = 0; i < titleArray.length; i++) {

                currTitle = decodeHTMLEntity(titleArray[i]);
                currRawArray = decodeHTMLEntity(rawArray[i]);

                // console.log(currTitle);
                // console.log(currRawArray);

                [rating, duration, language] = extractDetails(currRawArray);
                const currRating = rating.replace(/^Rated\s*/, ''); 

                // console.log(`
                //         -----
                //         Title: ${currTitle}
                //         Duration: ${duration}
                //         Description: ${language}
                //         Rating: ${currRating}
                //         -----
                //     `);

                weFilmsObject.push({
                    title: currTitle,
                    tags: null,
                    description: language,
                    duration: duration,
                    rating: currRating,
                    bookTicketsUrl: url,
                    posterSrc: null
                });

            }

            console.log(`number of we movies => ${weFilmsObject.length}`);

            return weFilmsObject;

        } else {}

    } else {
        console.log('HTML content not found');
    }
};

function getCurrentDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
}

module.exports = { extractFilmsWe };

// ----- EXECUTION CODE -----
    // - for testing
    // - actual usage to be called from /src/main.js

// extractFilmsWe(`https://www.wecinemas.com.sg/buy-ticket.aspx?movieid=&date=07/26/2024`).then((weFilmsObject) => {
//     if (weFilmsObject) {
//         console.log(JSON.stringify(weFilmsObject, null, 2));
//     } else {
//         console.log('no movies data were found');
//     }
// });

// extractFilmsWe(`https://www.wecinemas.com.sg/buy-ticket.aspx?movieid=&date=${getCurrentDate()}`).then((weFilmsObject) => {
//     if (weFilmsObject) {
//         console.log(JSON.stringify(weFilmsObject, null, 2));
//     } else {
//         console.log('no movies data were found');
//     }
// });
