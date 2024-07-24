// ----------

// GOLDEN VILLAGE SCRAPER

// - parses data from https://www.gv.com.sg/GVMovies

// ~~~ fua ~~~
    // - i want to extract the following
        // thumbnail
        // poster
        // caption
            // h5 ng-binding
            // caption-times ng-binding

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
        // const gvFilms = doc.querySelectorAll('#nowMovieThumb');

        const gvFilms = doc.querySelectorAll('[id^="nowMovieThumb"]');
        console.log(`number of movies => ${gvFilms.length}`);

        if (gvFilms.length) {
            gvFilms.forEach(gvFilm => {
                    // console.log(gvFilm.innerHTML);
                    const poster = gvFilm.querySelector('.poster img');
                    const posterSrc = poster ? poster.getAttribute('src') : 'N/A';
                    const title = gvFilm.querySelector('.caption h5');
                    let titleText = title ? title.textContent.trim() : 'N/A';
                    titleText = titleText.replace(/[+\^*]+$/, '');
                    const duration = gvFilm.querySelector('.caption-times');
                    const durationText = duration ? duration.textContent.trim() : 'N/A';
                    console.log(`Poster src: ${posterSrc}`);
                    console.log(`Title: ${titleText}`);
                    console.log(`Duration: ${durationText}`);
                    console.log("-----");
            });
        } else {
            console.log('No gv films found');
        }
    } else {
        console.log('HTML content not found');
    }
};

// ----- EXECUTION CODE -----

extractFilms("https://www.gv.com.sg/GVMovies");