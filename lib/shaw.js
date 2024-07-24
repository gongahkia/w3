// ----------

// - this api does not do what i want (https://github.com/PopcornData/shaw-scraper), for all intents and purposes its deprecated
// - parses data from https://shaw.sg/movie
// - this does NOT work yet due to the way shaw loads their pages, so the first 2 movies and last movie are rendered while all interemediate movies are not

// - i want to extract the following 
    // movie_list_poster 
    //     img src
    // list_movies
    //     info
    //         title
    //         movie_duration
    //     list_text_div
    //         list_text_description

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
        console.log(doc.title);
        console.log(doc.body.innerHTML)
        const rowMovieList = doc.querySelectorAll('.movies_item-movie.row.block-list-showtimes');
        console.log(rowMovieList.length)
        if (rowMovieList.length) {
            rowMovieList.forEach(film => {
                const titleElement = film.querySelector('.info .title');
                const imgElement = film.querySelector('.movie_list_poster img');
                const durationElement = film.querySelector('.info .movie-duration');
                const descriptionElement = film.querySelector('.info .list_text_description');
                const title = titleElement ? titleElement.textContent : 'No Title';
                const imgSrc = imgElement ? imgElement.src : 'No Image';
                const duration = durationElement ? durationElement.textContent : 'No Duration';
                const description = descriptionElement ? descriptionElement.textContent : 'No Description';
                console.log({ title, imgSrc, duration, description });
            });
        } else {
            console.log('No films found');
        }
    } else {
        console.log('HTML content not found');
    }
};

// ----- EXECUTION CODE -----

extractFilms("https://shaw.sg/Showtimes/2024-07-24/All/All");