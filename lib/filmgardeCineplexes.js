// ----------

// FILMGARDE CINEPLEXES SCRAPER

// - parses data from https://fgcineplex.com.sg/movies
// - extracts the following
    // hover-box tour-hotel-box show-product-box 
        // tour-img image
            // a href
            // img src
        // img-category
            // img alt (for the rating)
        // left_side
            // h4
            // a href
        // list-inline
            // Duration, Genre, Language
        // read-btn by-ticket

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

async function extractFilmsFgc(url) {

    const htmlText = await fetchAndParseHTML(url);

    if (htmlText) {
        const { JSDOM } = require('jsdom');
        const dom = new JSDOM(htmlText);
        const doc = dom.window.document;

        // -- debugging -- 
        // console.log(doc.title);
        // console.log(doc.body.innerHTML)

        const fgFilms = doc.querySelectorAll('.hover-box.tour-hotel-box.show-product-box');

        function decodeHTMLEntity(encodedString) {
            const textarea = doc.createElement('textarea');
            textarea.innerHTML = encodedString;
            return textarea.value;
        }

        function extractDetails(details) {
            const durationRegex = /Duration:\s*(\d+)\s*mins/;
            const genreRegex = /Genre:\s*([^,]+)/;
            const languageRegex = /Language:\s*(.*)/;
            const durationMatch = details.match(durationRegex);
            const genreMatch = details.match(genreRegex);
            const languageMatch = details.match(languageRegex);
            const duration = durationMatch ? `${durationMatch[1]} mins` : 'N/A';
            const genre = genreMatch ? genreMatch[1] : 'N/A';
            const language = languageMatch ? languageMatch[1] : 'N/A';
            return [duration, genre, language];
        }

        const fgFilmsObject = [];

        if (fgFilms.length) {
            fgFilms.forEach(fgFilm => {

                    // console.log(fgFilm.innerHTML);

                    const title = fgFilm.querySelector('.left_side h4 a')?.innerHTML || 'N/A';
                    const titleText = decodeHTMLEntity(title);
                    const posterSrc = fgFilm.querySelector('.tour-img.image img')?.getAttribute('src') || 'N/A';
                    const rating = fgFilm.querySelector('.img-category img')?.getAttribute('alt') || 'N/A';
                    const bookTicketUrl = fgFilm.querySelector('.read-btn.by-ticket')?.getAttribute('href') || 'N/A';
                    const rawDetails = fgFilm.querySelector('.list-inline')?.querySelectorAll('li p');
                    const rawDetailsArray = rawDetails ? Array.from(rawDetails).map(li => decodeHTMLEntity(li.innerHTML)?.replace(/<\/?(b|em|strong|i|p)\b[^>]*>/gi, '').replace(/<br\s*\/?>/gi, ' | ').replace(/\s{2,}/g, ' ').trim()).join(', ') : ['N/A'];
                    [duration, theme, language] = extractDetails(rawDetailsArray);

                    // console.log(`
                    //         -----
                    //         Title: ${titleText}
                    //         Theme: ${theme}
                    //         Duration: ${duration}
                    //         Description: ${language}
                    //         Rating: ${rating}
                    //         Poster src: ${posterSrc}
                    //         Book ticket Url: ${bookTicketUrl}
                    //         -----
                    //     `);

                    fgFilmsObject.push({
                        title: titleText,
                        tags: theme,
                        description: language,
                        duration: duration,
                        rating: rating,
                        bookTicketsUrl: bookTicketUrl,
                        posterSrc: posterSrc
                    });

            });

            console.log(`number of fg movies => ${fgFilmsObject.length}`);

            return fgFilmsObject;
        } else {
            console.log('no filmgarde cineplexes films were found');
        }
    } else {
        console.log('HTML content not found');
    }
};

module.exports = { extractFilmsFgc };

// ----- EXECUTION CODE -----
    // - for testing
    // - actual usage to be called from /src/main.js

// extractFilms("https://fgcineplex.com.sg/movies").then((fgFilmsObject) => {
//     if (fgFilmsObject) {
//         console.log(JSON.stringify(fgFilmsObject, null, 2));
//     } else {
//         console.log('no movies data were found');
//     }
// });
