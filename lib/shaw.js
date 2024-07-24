// this api does not do what i want (https://github.com/PopcornData/shaw-scraper), for all intents and purposes its deprecated

// parses data from https://shaw.sg/movie

// ----------

// TRY THIS BELOW IF THE NORMAL FETCHING DOESNT WORK

// const puppeteer = require('puppeteer');

// async function fetchFullPageHTML(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     // Optionally scroll down to trigger lazy loading
//     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
//     await page.waitForTimeout(2000); // wait for lazy-loaded content

//     const html = await page.content();
//     await browser.close();
    
//     return html;
// }

// // Usage
// fetchFullPageHTML('https://example.com').then(html => {
//     console.log(html); // Process the HTML
// });

// requires the following dependancy installs
    // npm install jsdom
    // npm install node-fetch

(async () => {

// ----- IMPORTS -----

    const { default: fetch } = await import('node-fetch');

    async function fetchAndParseHTML(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error, status: ${response.status}`);
            }
            const htmlText = await response.text();
            const { JSDOM } = require('jsdom');
            const dom = new JSDOM(htmlText);
            const doc = dom.window.document;
            return doc;
        } catch (error) {
            console.error('Error fetching HTML:', error);
        }
    }

// ----- EXECUTION CODE -----

// movie_list_poster 
//     img src
// list_movies
//     info
//         title
//         movie_duration
//     list_text_div
//         list_text_description

    const url = 'https://shaw.sg/movie';
    const searchTerm = 'movies_item-movie row block-list-showtimes';
    fetchAndParseHTML(url).then((doc) => {
        if (doc) { // only run if the doc exists
            console.log(doc.title); 
            console.log(doc.innerHTML);
            const shawFilms = doc.querySelectorAll(`${searchTerm}`);
            console.log(`number of films => ${shawFilms.length}`)
            // shawFilms.foreach()
        } else {}
    });
})();