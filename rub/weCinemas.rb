# ----------

# WE CINEMAS SCRAPER

# - parses data from https://www.wecinemas.com.sg/buy-ticket.aspx?movieid=&date=07/24/2024
    # date is in the format of MM/DD/YYYY

# - extracts the following
    # h3
    # content-common-txt
    # showtimes-but a

# ----------

require 'selenium-webdriver'
require 'nokogiri'
require 'json'
require 'cgi'

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
  CGI.unescapeHTML(encoded_string)
end

def extract_details(details)
  details.split(',').map(&:strip)
end

def extract_films(url)
  html_text = fetch_and_parse_html(url)
  return unless html_text

  doc = Nokogiri::HTML(html_text)
  
  we_films = doc.at_css('#DataListCinemas_DataListDate_0_DataListMovietitle_0 tbody')

  we_films_object = []

  if we_films
    title_array = we_films.css('h3 a').map { |el| decode_html_entity(el.inner_html) } || ['N/A']
    raw_array = we_films.css('.content-common-txt').map { |el| decode_html_entity(el.inner_html) } || ['N/A']

    title_array.each_with_index do |curr_title, i|
      curr_raw = raw_array[i] || 'N/A'
      details = extract_details(curr_raw)
      rating = details[0].to_s.gsub(/^Rated\s*/, '')
      duration = details[1] || 'N/A'
      language = details[2] || 'N/A'

      we_films_object << {
        title: curr_title,
        tags: nil,
        description: language,
        duration: duration,
        rating: rating,
        book_tickets_url: url,
        poster_src: nil
      }
    end

    puts "Number of WE movies => #{we_films_object.length}"

    we_films_object
  else
    puts 'No WE films found'
    nil
  end
rescue => e
  puts "Error extracting films: #{e.message}"
  nil
end

def get_current_date
  today = Date.today
  today.strftime('%m/%d/%Y')
end

# ----- EXECUTION CODE -----

    # For testing

films = extract_films("https://www.wecinemas.com.sg/buy-ticket.aspx?movieid=&date=07/29/2024")
if films
  puts JSON.pretty_generate(films)
else
  puts 'No movies data were found'
end

    # Extract films for the current date

# films = extract_films("https://www.wecinemas.com.sg/buy-ticket.aspx?movieid=&date=#{get_current_date}")
# if films
#   puts JSON.pretty_generate(films)
# else
#   puts 'No movies data were found'
# end