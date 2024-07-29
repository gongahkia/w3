# ----------

# GOLDEN VILLAGE SCRAPER

# - parses data from https://www.gv.com.sg/GVMovies
# - extracts the following
    # thumbnail
    # poster
    # caption
        # h5 ng-binding
        # caption-times ng-binding

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

  gv_films = doc.css('[id^="nowMovieThumb"]') 

  gv_films_object = []

  if gv_films.any?
    gv_films.each do |gv_film|
      poster_src = gv_film.at_css('.poster img')&.[]('src') || 'N/A'
      title = gv_film.at_css('.caption h5')
      title_text = title ? title.text.strip : 'N/A'
      title_text = title_text.gsub(/[+\^*]+$/, '')
      duration = gv_film.at_css('.caption-times')
      duration_text = duration ? duration.text.strip : 'N/A'

      gv_films_object << {
        title: title_text,
        tags: nil,
        description: nil,
        duration: duration_text,
        rating: nil,
        book_tickets_url: "https://www.gv.com.sg/GVMovies",
        poster_src: poster_src
      }
    end

    puts "Number of GV movies => #{gv_films_object.length}"
    gv_films_object
  else
    puts 'No GV films found'
    nil
  end
rescue => e
  puts "Error extracting films: #{e.message}"
  nil
end

# ----- EXECUTION CODE -----
    # For testing

films = extract_films("https://www.gv.com.sg/GVMovies")
if films
  puts JSON.pretty_generate(films)
else
  puts 'No movies data were found'
end