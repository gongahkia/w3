# `we watch what`

Webscraper for movies in your area.

![](asset/tyler.gif)

--- 

![](asset/man.jpg)

## Implement log

1. websites to scrape 

### in-person screenings

| site | scraping implementation |
| :--- | :--- |
| https://www.gv.com.sg/ | :white_check_mark: |
| https://www.eaglewingscinematics.com.sg/ | :white_check_mark: |
| https://theprojector.sg/ | :x: |
| https://fgcineplex.com.sg/movies | :x: |
| https://www.wecinemas.com.sg/ | :x: |
| https://www.sinema.sg/ | :x: |
| https://shaw.sg/ | :x: |
| https://www.cathaycineplexes.com.sg/ | :x: |

### online streaming

| site | scraping implementation |
| :--- | :--- |
| https://cinemaworld.asia/ | :x: |
| https://mubi.com/en/sg | :x: |

2. is porting over code from python to js neccesary?
3. geolocation api
4. create a github project site page so can be run from any phone
5. furnish readme.md
6. add options to run locally
7. expose REST API for cinemas so others can use

REST API follows this general format, where each film object comprises of type [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String). An array of film objects is returned.

```json
{
    title: null
    description: null,
    duration: null
    rating: null,
    bookTicketsUrl: null,
    posterSrc: null
}
```

8. make binary as small as possible
9. make site sexy with react