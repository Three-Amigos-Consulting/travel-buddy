'strict';

// ===========================
// Build out the initial server
// ===========================

//Required Dependencies
const express = require('express');
const superagent = require('superagent');
// const cors = require('cors');
const pg = require('pg');

require('dotenv').config();


//Create an instance of express in the variable app
const app = express();

// Establish the PORT number for the server
const PORT = process.env.PORT || 3000;

// Tell the server to get files from the public folder
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//Start database connection
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

client.on('error', err => console.error(err));

// Tell express to use EJS files
app.set('view engine', 'ejs');


// Method Override
// app.use(methodOverride((request, response) => {
//   if (request.body && typeof request.body === 'object' && '_method' in request.body) {
//     // look in urlencoded POST bodies and delete it
//     let method = request.body._method;
//     delete request.body._method;
//     return method;
//   }
// }))


// ++++++++++++++++
// Routes to listen
// ++++++++++++++++

// index.ejs
app.get('/', renderHomePage);
app.get('/explore', getSQL);
app.get('/details/:id', getCountry);
app.get('/big-mac-index', renderBigMac)

//Set the catch all route
app.get('*', (request, response) => response.status(404).render('pages/404-error.ejs', { errorResult: '' }));

// Activate the server
app.listen(PORT, () => console.log(`(TRAVEL BUDDY) listening on: ${PORT}`));


// +++++++++++++++++++++++++++++++++
// Constructor functions
// +++++++++++++++++++++++++++++++++

function Countries(data) {
  this.id = data.id;
  this.country_name = data.country_name;
  this.capital = data.capital;
  this.country_code = data.country_code;
  this.currency_code = data.currency_code;
  this.exchange_rate = data.exchange_rate;
  this.local_bmi = data.local_bmi;
  this.usa_bmi = data.usa_bmi;
  this.flag_url = data.flag_url;
  this.created_date = Date.now();
}

Countries.allCountries = [];

// +++++++++++++++++++++++++++++++++
// Helper functions
// +++++++++++++++++++++++++++++++++

function renderHomePage(request, response) { response.render('index'); }
function renderBigMac(request, response) {response.render('pages/big-mac-index'); }

// Get the API info for currency from fixer.io and returns an array of arrays with currency code and exchange rate in each array.
function getCurrency() {
  console.log('** Retrieving Currency from API');
  const url = `https://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_KEY}&base=USD`;

  let ratesArray = [];
  return superagent(url)
    .then(result => {
      ratesArray = Object.entries(result.body.rates);
      return ratesArray;
    })
    .catch(err => processErrors(err))
}

// Get API info from RESTcountries to populate capital and flag_url info.  The function will receive information from our SQL database to limit the countries being requested.

function getCapitalsAndFlags(data) {
  // For each country code we will add the code to a variable that appends to the end of the Restcountries API.
  console.log('*** Retrieving Capitals and Flags from API');

  let countryCodes = '';

  data.forEach(country => {
    countryCodes += `${country.country_code};`;
  })

  const url = `https://restcountries.eu/rest/v2/alpha?codes=${countryCodes}`;

  return superagent(url)
    .then(result => {
      let capitalArray = [];
      result.body.forEach(country => {
        capitalArray.push([country.alpha3Code, country.capital, country.flag]);
      })
      return capitalArray;
    })
    .catch(err => processErrors(err));
}

// Retrieve the data from the SQL server and update it with the API info
function getSQL(request, response) {
  console.log('* Retrieving stored data from SQL Server');

  const SQL = `SELECT * FROM countries;`;

  let countriesDB = [];
  let currency = [];
  let capitalsAndFlags = [];
  Countries.allCountries = [];

  client.query(SQL)
    // First get the data from the SQL server
    .then(results => countriesDB = results.rows)
    // Use the SQL data to help get capitals and flags
    .then(countries => getCapitalsAndFlags(countries))
    .then(capsAndFlags => {
      capitalsAndFlags = capsAndFlags;
    })
    // Get the current currency rates
    .then(getCurrency)
    .catch(err => processErrors(err))
    .then(rates => {
      currency = rates;
    })
    .catch(err => processErrors(err))
    // Update data with the retrived information and calculate the current Big Mac Index for each country
    .then(() => {
      countriesDB.forEach(country => {
        // merge current rates into country data
        let rate = currency.find(value => value[0] === country.currency_code);
        country.exchange_rate = rate[1];

        // merge capitals and flags into data
        let capitalFlag = capitalsAndFlags.find(value => value[0] === country.country_code);
        country.capital = capitalFlag[1];
        country.flag_url = capitalFlag[2];

        //calculate Big Mac Index for USD in local country
        country.usa_bmi = country.local_bmi / country.exchange_rate;

        //create an instance of each country with the constructor
        Countries.allCountries.push(new Countries(country));
      })
    })
    // Save updated data back to database
    .then(() => updateCountryDb())
    // Render the results of the updated information
    .then(() => showExplore(request, response))
    .catch(err => processErrors(err, response));
}

// Saves the updated data back to the SQL Server
function updateCountryDb() {
  console.log('**** UPDATING SQL Database');

  // console.log(Countries.allCountries);

  Countries.allCountries.forEach(country => {
    let { id, country_name, capital, country_code, currency_code, exchange_rate, local_bmi, usa_bmi, flag_url, created_date } = country;

    const SQL = `UPDATE countries SET country_name=$2, capital=$3, country_code=$4, currency_code=$5, exchange_rate=$6, local_bmi=$7, usa_bmi=$8, flag_url=$9, created_date=$10 WHERE id=$1;`;

    const values = [id, country_name, capital, country_code, currency_code, exchange_rate, local_bmi, usa_bmi, flag_url, created_date];

    return client.query(SQL, values);
  })
}

function showExplore(request, response) {
  console.log('***** Preparing to render results');

  // sort the countries by Big Mac Index first
  Countries.allCountries.sort((a, b) => a.usa_bmi - b.usa_bmi);

  response.render('pages/explore/show', { countries: Countries.allCountries })
}

function getCountry(request, response) {
  console.log('\n\n# Retrieiving the requested country');

  const requestedId = parseInt(request.params.id);
  let countryDetail = Countries.allCountries.find(value => {
    return value.id === requestedId;
  })
  console.log(countryDetail);

  getHotels(countryDetail)
    .then(() => getRestaurants(countryDetail)
      .then(results => {
        console.log(Hotels.allHotels)
        response.render('pages/detail/show', {
          country: countryDetail,
          restaurants: results,
          hotels: Hotels.allHotels
        })
      }
      ))
    .catch(err => processErrors(err, response))

  // return response.render('pages/detail/show', { country: countryDetail, restuarants: Restaurants.allRestaurants, hotels: Hotels.allHotels });

}


///////////////////////////////////////////////////////////////////////////////////////////////////
//                                 TESTING GOOGLE MAPS/PLACES                                    //
///////////////////////////////////////////////////////////////////////////////////////////////////

function getHotels(obj) {
  console.log('Getting Hotel Function');
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+${obj.capital},${obj.country_name}&key=${process.env.GOOGLE_API_KEY}`

  return superagent(url)
    .then(result => {
      let hotelData = [];
      result.body.results.forEach(data => {
        // console.log(data);
        hotelData.push({
          name: data.name,
          rating: data.rating,
          address: data.formatted_address,
          photos: data.photos[0].photo_reference,
          latitude: data.geometry.location.lat,
          longitude: data.geometry.location.lng
        });
      })
      hotelData.forEach(hotel => {
        Hotels.allHotels.push(new Hotels(hotel));
      })
      // console.log(Hotels.allHotels.length)
      Hotels.allHotels.sort((a, b) => b.rating - a.rating);
      Hotels.allHotels.length = 5;
      // console.log(Hotels.allHotels);
      // return hotelData;
    })
    .catch(err => processErrors(err));
}

function getRestaurants(obj) {
  console.log('Getting Restaurant Function')
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+${obj.capital},${obj.country_name}&key=${process.env.GOOGLE_API_KEY}`

  return superagent(url)
    .then(result => {
      let foodData = [];
      result.body.results.forEach(data => {
        foodData.push({
          name: data.name,
          rating: data.rating,
          price: data.price_level,
          address: data.formatted_address,
          photos: data.photos[0].photo_reference,
          latitude: data.geometry.location.lat,
          longitude: data.geometry.location.lng,
        });
      })
      // console.log(foodData);
      foodData.forEach(food => {
        Restaurants.allRestaurants.push(new Restaurants(food));
      })
      // console.log(Restaurants.allRestaurants.length)
      Restaurants.allRestaurants.sort((a, b) => b.rating - a.rating);
      // console.log(Restaurants.allRestaurants);

      return foodData;
    })
  // .catch(err => processErrors(err));
}

// function getImageURL(data) {
//   const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.photos}&key=${process.env.GOOGLE_API_KEY}`

//   return superagent(url)
//     .then(result => {
//       return result.request.url
//     })
// }

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                     GOOGLE CONSTRUCTORS                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////


function Restaurants(data) {
  this.name = data.name;
  this.price = data.price || 'Not Available';
  this.rating = data.rating;
  this.address = data.address;
  this.latitude = data.latitude;
  this.longitude = data.longitude;
  this.photos = data.photos;
}

Restaurants.allRestaurants = [];

function Hotels(data) {
  this.name = data.name;
  this.rating = data.rating;
  this.address = data.address;
  this.latitude = data.latitude;
  this.longitude = data.longitude;
  this.photos = data.photos
}

Hotels.allHotels = [];



// Error Handler
function processErrors(err) {
  console.error(err);
}
