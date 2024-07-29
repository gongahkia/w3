> [!NOTE]  
> W3 is not under active development  
> right now.  
>  
> Support for data scraped from other  
> cinemas and streaming platforms  
> might come in the far future.  
>  
> *\- Gabriel*  

![](https://img.shields.io/badge/w3_1.0-passing-green)

# `We Watch What`

Search engine for movies showing in your area.  

![](asset/tyler.gif)

## Coverage
  
W3 collates films by scraping webpages for the below cinemas.  
  
| Site | Implementation log |
| :--- | :--- |
| [Golden Village](https://www.gv.com.sg/) | :white_check_mark: |
| [Eagle Wings Cinematics](https://www.eaglewingscinematics.com.sg/) | :white_check_mark: |
| [The Projector](https://theprojector.sg/) | :white_check_mark: |
| [Filmgarde Cineplexes](https://fgcineplex.com.sg/movies) | :white_check_mark: |
| [WE Cinemas](https://www.wecinemas.com.sg/) | :white_check_mark: |
| [Shaw Theatres](https://shaw.sg/) | :construction: |
| [Cathay Cineplexes](https://www.cathaycineplexes.com.sg/) | :x: |
  
## Features

These are the features that W3 provides to distinguish itself from other products in the market.

* API for public use
    * Exposes an easy-to-use REST API for [these cinemas](#coverage).
    * API documentation available [here](#api-usage).

## Contribute

W3 is open-source. Feel free to [open a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) and contribute. Below are features that W3 aims to implement in the future. 

* `WeWatchWhat` website
    * Single unified platform that aggregates all movies showing on the current day from multiple cinemas.
    * Shows all essential details about a film at a glance.
    * Filters movies based on rating, duration, cinema location, languages and theme.
    * ***We watch what*** button that randomly chooses a movie to watch.
* Bookmarking
    * Films can be bookmarked for later reference.
    * Filters are stored in query params such that a specific search.
* Web access  
    * No mobile app required to search for movies.
    * W3 is a web application, meaning no installation is required and it can run on any device that has a browser. 

## Development
  
To run W3 locally, you can run the [`Makefile`](#install-via-makefile) or [do it yourself](#do-it-yourself).  
  
### Install via Makefile  
  
```console
$ make build
$ cd lib
$ node <cinemaName>.js
```
  
### Do it yourself  
  
First, install [NVM](https://github.com/nvm-sh/nvm), [npm](https://www.npmjs.com/) and [Node.js](https://nodejs.org/en).  
  
Then, install [playwright](https://playwright.dev/) as a dependancy.  
  
Next, run the JavaScript file with the filepath `./lib/<cinemaName>.js` where `<cinemaName>` is one of the following.  
  
* weCinemas  
* theProjector  
* shawTheatres  
* goldenVillage  
* filmgardeCineplexes  
* eagleWingsCinematics  
  
## API Usage
  
* Each film object comprises of the below attributes.
    * `title`: movie title
    * `tags`: genre, categories, themes
    * `description`: blurb, languages
    * `duration`: in minutes
    * `rating`: age guidelines
    * `bookTicketsUrl`: ticket booking url
    * `posterSrc`: img source url
* Each attribute is of the [*String*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) datatype.
* Attributes that were not found are assigned the [*null*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null) value.

```json
{
    title: null
    tags: null,
    description: null,
    duration: null
    rating: null,
    bookTicketsUrl: null,
    posterSrc: null
}
```