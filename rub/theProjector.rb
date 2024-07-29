# ----------

# THE PROJECTOR SCRAPER

# - parses data from https://theprojector.sg/films
# - extracts the following
    # event-list-item-module--cover-image--1H3q2 > picture
    # event-list-item-module--title--1r-44
    # rating-module--rating--3GlKm 
    # event-list-item-module--blurb--1Mh9e
    # event-list-item-module--theme--3QO97

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

def decode_html_entity(encoded_string)
  doc = Nokogiri::HTML::DocumentFragment.parse(encoded_string)
  doc.text
end

def extract_films(url)
  html_text = fetch_and_parse_html(url)
  return unless html_text

  doc = Nokogiri::HTML(html_text)

  proj_films = doc.css('.event-list-item-module--event-list-item--3aAfb.event-list-module--event-list-item--1YddO.undefined')

  proj_films_object = []

  if proj_films.any?
    proj_films.each do |proj_film|
      cover_image_src = proj_film.at_css('.event-list-item-module--cover-image--1H3q2 img')&.[]('src') || 'N/A'
      title = proj_film.at_css('.event-list-item-module--title--1r-44 a')&.text.strip || 'N/A'
      rating = proj_film.at_css('.rating-module--rating--3GlKm')&.text.strip || 'N/A'
      raw_blurb = proj_film.at_css('.event-list-item-module--blurb--1Mh9e')&.inner_html || 'N/A'
      clean_blurb = decode_html_entity(raw_blurb)
        .gsub(/<\/?(b|em|strong|i|p)\b[^>]*>/i, '')
        .gsub(/<br\s*\/?>/i, ' | ')
        .gsub(/\s{2,}/, ' ')
        .strip
      theme = proj_film.at_css('.event-list-item-module--theme--3QO97')&.text.strip || 'N/A'

      proj_films_object << {
        title: title,
        tags: theme,
        description: clean_blurb,
        duration: nil,
        rating: rating,
        book_tickets_url: "https://theprojector.sg/films",
        poster_src: cover_image_src
      }
    end

    puts "Number of TP movies => #{proj_films_object.length}"
    proj_films_object
  else
    puts 'Zero The Projector films were found'
    nil
  end
rescue => e
  puts "Error extracting films: #{e.message}"
  nil
end

# ----- EXECUTION CODE -----
    # For testing

films = extract_films("https://theprojector.sg/films")
if films
  puts JSON.pretty_generate(films)
else
  puts 'No movies data were found'
end