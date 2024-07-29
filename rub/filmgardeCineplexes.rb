# ----------

# FILMGARDE CINEPLEXES SCRAPER

# - parses data from https://fgcineplex.com.sg/movies
# - extracts the following
    # hover-box tour-hotel-box show-product-box 
        # tour-img image
            # a href
            # img src
        # img-category
            # img alt (for the rating)
        # left_side
            # h4
            # a href
        # list-inline
            # Duration, Genre, Language
        # read-btn by-ticket

# ----------

require 'selenium-webdriver'
require 'nokogiri'
require 'json'

def fetch_and_parse_html(url)
  begin
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
end

def extract_films(url)
  html_text = fetch_and_parse_html(url)
  return unless html_text

  doc = Nokogiri::HTML(html_text)
  fg_films = doc.css('.hover-box.tour-hotel-box.show-product-box')

  def decode_html_entity(encoded_string)
    Nokogiri::HTML::DocumentFragment.parse(encoded_string).text
  end

  def extract_details(details)
    duration_regex = /Duration:\s*(\d+)\s*mins/
    genre_regex = /Genre:\s*([^,]+)/
    language_regex = /Language:\s*(.*)/

    duration_match = details.match(duration_regex)
    genre_match = details.match(genre_regex)
    language_match = details.match(language_regex)

    duration = duration_match ? "#{duration_match[1]} mins" : 'N/A'
    genre = genre_match ? genre_match[1] : 'N/A'
    language = language_match ? language_match[1] : 'N/A'
    [duration, genre, language]
  end

  fg_films_object = []

  if fg_films.any?
    fg_films.each do |fg_film|
      title = fg_film.at_css('.left_side h4 a')&.inner_html || 'N/A'
      title_text = decode_html_entity(title)
      poster_src = fg_film.at_css('.tour-img.image img')&.[]('src') || 'N/A'
      rating = fg_film.at_css('.img-category img')&.[]('alt') || 'N/A'
      book_ticket_url = fg_film.at_css('.read-btn.by-ticket')&.[]('href') || 'N/A'
      raw_details = fg_film.at_css('.list-inline')&.css('li p')
      raw_details_array = raw_details ? raw_details.map { |li| decode_html_entity(li.inner_html).gsub(/<\/?(b|em|strong|i|p)\b[^>]*>/i, '').gsub(/<br\s*\/?>/, ' | ').gsub(/\s{2,}/, ' ').strip }.join(', ') : 'N/A'
      duration, theme, language = extract_details(raw_details_array)

      fg_films_object << {
        title: title_text,
        tags: theme,
        description: language,
        duration: duration,
        rating: rating,
        book_tickets_url: book_ticket_url,
        poster_src: poster_src
      }
    end

    puts "Number of fg movies => #{fg_films_object.length}"
    fg_films_object
  else
    puts 'No filmgarde cineplexes films were found'
    nil
  end
rescue => e
  puts "Error extracting films: #{e.message}"
  nil
end

# ----- EXECUTION CODE -----
  # For testing

films = extract_films("https://fgcineplex.com.sg/movies")
if films
  puts JSON.pretty_generate(films)
else
  puts 'No movies data were found'
end