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

//Set the catch all route
app.get('*', (request, response) => response.status(404).render('pages/404-error.ejs'));

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
  this.flag_url = data.flag_url
  this.created_date = Date.now();
}

Countries.allCountries = [];

// +++++++++++++++++++++++++++++++++
// Helper functions
// +++++++++++++++++++++++++++++++++

function renderHomePage(request, response) { response.render('index'); }

// Get the API info for currency from fixer.io and returns an array of arrays with currency code and exchange rate in each array.
function getCurrency() {
  const url = `http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_KEY}&base=USD`;

  return superagent(url)
    .then(result => {
      let ratesArray = Object.entries(result.body.rates);
      return ratesArray;
    })
}

// Get API info from RESTcountries to populate capital and flag_url info.  The function will receive information from our SQL database to limit the countries being requested.

function getCapitalsAndFlags(data) {
  // For each country code we will add the code to a variable that appends to the end of the Restcountries API.

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

function getSQL(request, response) {
  console.log('STARTING THE SQL PULL');

  const SQL = `SELECT * FROM countries;`;

  let countriesDB = [];
  let currency = [];
  let capitalsAndFlags = [];


  client.query(SQL)
    .then(results => countriesDB = results.rows)
    .then(countries => getCapitalsAndFlags(countries)
      .then(capsAndFlags => capitalsAndFlags = capsAndFlags))
    .then(getCurrency()
      .then(rates => currency = rates))
    .catch(err => processErrors(err))
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
    .then(() => updateCountryDb())
    .then(() => showExplore(request, response))
    .catch(err => processErrors(err));

}

function showExplore(request, response) {
  response.render('pages/explore', {countries: Countries.allCountries})
}




function updateCountryDb() {

  console.log('!!!!!!!!!!!!!!!!!!!!!!!!\n\nStarting SQL Update\n\n!!!!!!!!!!!!!!!!!!!!!!');

  Countries.allCountries.forEach(country => {
    let { id, country_name, capital, country_code, currency_code, exchange_rate, local_bmi, usa_bmi, flag_url, created_date } = country;

    const SQL = `UPDATE countries SET country_name=$2, capital=$3, country_code=$4, currency_code=$5, exchange_rate=$6, local_bmi=$7, usa_bmi=$8, flag_url=$9, created_date=$10 WHERE id=$1;`;

    const values = [id, country_name, capital, country_code, currency_code, exchange_rate, local_bmi, usa_bmi, flag_url, created_date];

    return client.query(SQL, values);
  })

  console.log('!!!!!!!!!!!!!!!!!!!!!!!!\n\nYOU ARE A WINNER\n\n!!!!!!!!!!!!!!!!!!!!!!');

}



// // Error Handler
function processErrors(error, response) {
  response.render('pages/404-error', { errorResult: error })
}
