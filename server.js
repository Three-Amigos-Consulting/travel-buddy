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
// console.log(client);
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

// console.log(client.query(SQL));

// index.ejs
app.get('/', getSQL);
// app.get('/', renderHomePage);

//Set the catch all route
app.get('*', (request, response) => response.status(404).render('pages/404-error.ejs'));

// Activate the server
app.listen(PORT, () => console.log(`(TRAVEL BUDDY) listening on: ${PORT}`));


// +++++++++++++++++++++++++++++++++
// Constructor functions
// +++++++++++++++++++++++++++++++++

function Countries(data) {
  this.id = data.id;
  this.name = data.country_name;
  this.capital = data.capital;
  this.country_code = data.country_code;
  this.currency_code = data.currency_code;
  this.exchange_rate = data.exchange_rate;
  this.local_bmi = data.local_bmi;
  this.usa_bmi = data.usa_bmi;
  this.flag = data.flag_url
}

// +++++++++++++++++++++++++++++++++
// Helper functions
// +++++++++++++++++++++++++++++++++

// function renderHomePage(request, response) { response.render('index'); }

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

  // console.log(`+++++++++++++++++++++++\n\n`);
  // console.log('RETRIEVING CAPITALS AND FLAGS');
  // console.log(`\n\n+++++++++++++++++++++++`);

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

function getSQL() {
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
        let rate = currency.find(value => value[0] === country.currency_code);
        console.log('new rate', rate)
        country.exchange_rate = rate[1];

        let capitalFlag = capitalsAndFlags.find(value => value[0] === country.country_code);

        country.capital = capitalFlag[1];
        country.flag_url = capitalFlag[2];

        console.log('after', country.capital, country.flag_url);

        console.log('NEW BMI', country.country_name, country.local_bmi / country.exchange_rate);

      })
    });




  // .then(result => {

  // getCurrency()

  // getCapitalsAndFlags(result.rows)
  // .then(result => {


  // let arrObj = result.rows;
  // let arrArr = getCurrency();
  // arrObj.forEach(country => {
  //   let xx = arrArr.find(element => element[0] === country.currency_code)
  //   country.exchange_rate = xx[1];
  //   country.USA_bmi = country.local_bmi / country.exchange_rate;


  // })
  // })
  //   .catch(err => processErrors(err, response));
}


// // Error Handler
function processErrors(error, response) {
  response.render('pages/404-error', { errorResult: error })
}
