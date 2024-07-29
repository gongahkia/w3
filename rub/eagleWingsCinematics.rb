# ----------

# EAGLE WINGS CINEMATICS SCRAPER

# - parses data from https://www.eaglewingscinematics.com.sg/movies#openModal
# - extracts the following
    # img src
    # details-title
    # details-rating
    # details-description
    # details-book

# ----------

require 'selenium-webdriver'
require 'nokogiri'
require 'json' 

def fetch_and_parse_html(url)
  driver = Selenium::WebDriver.for :chrome
  driver.navigate.to url

  previous_height = driver.execute_script('return document.body.scrollHeight')
  loop do
    driver.execute_script('window.scrollTo(0, document.body.scrollHeight)')
    sleep 3 
    current_height = driver.execute_script('return document.body.scrollHeight')
    break if current_height == previous_height
    previous_height = current_height
  end

  content = driver.page_source
  driver.quit

  content
rescue => e
  puts "Error fetching HTML: #{e.message}"
  nil
end

def extract_films(url)
  html_text = fetch_and_parse_html(url)
  return unless html_text

  doc = Nokogiri::HTML(html_text)
  
  eagle_wings_cinematics_films = doc.css('.movie-list > li')
  num_movies = 0

  eagle_wings_cinematics_films_object = []

  eagle_wings_cinematics_films.each do |ewc_film|
    image_src = ewc_film.at_css('img')&.[]('src') || 'N/A'
    title = ewc_film.at_css('.details-title')
    title_text = title ? title.text.strip : 'N/A'
    rating = ewc_film.at_css('[class^="details-rating"]')
    rating_text = rating ? rating.text.strip : 'N/A'
    description = ewc_film.at_css('.details-description')
    description_text = description ? description.text.strip : 'N/A'
    book_tickets_url = ewc_film.at_css('.details-book')&.[]('href') || 'N/A'
    book_tickets_url_text = book_tickets_url.strip || 'N/A'

    eagle_wings_cinematics_films_object << {
      title: title_text,
      tags: nil,
      description: description_text,
      duration: nil,
      rating: rating_text,
      book_tickets_url: book_tickets_url_text,
      poster_src: image_src
    }

    num_movies += 1
  end

  puts "Number of ewc movies => #{num_movies}"

  puts JSON.pretty_generate(eagle_wings_cinematics_films_object)
rescue => e
  puts "Error extracting films: #{e.message}"
  nil
end

# ----- EXECUTION CODE -----
  # For testing

films = extract_films("https://www.eaglewingscinematics.com.sg/movies#openModal")
if films
  puts JSON.pretty_generate(films)
else
  puts 'No movies data were found'
end