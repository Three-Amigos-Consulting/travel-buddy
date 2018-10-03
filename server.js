'strict';

// ===========================
// Build out the initial server
// ===========================

//Required Dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
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
app.get('/', renderHomePage);

//Set the catch all route
app.get('*', (request, response) => response.status(404).render('pages/404-error.ejs'));

// Activate the server
app.listen(PORT, () => console.log(`(TRAVEL BUDDY) listening on: ${PORT}`));


// +++++++++++++++++++++++++++++++++
// Constructor functions
// +++++++++++++++++++++++++++++++++

function Countries(data) {
  this.id = data.id
  this.name = data.country_name,
  this.capital = data.capital,
  this.country_code = data.country_code,
  this.currency_code = data.currency_code,
  this.exchange_rate = data.exchange_rate,
  this.local_bmi = data.local_bmi,
  this.usa_bmi = data. usa_bmi,
  this.flag = data.flag_url
}

// +++++++++++++++++++++++++++++++++
// Helper functions
// +++++++++++++++++++++++++++++++++

function renderHomePage(request, response) { response.render('index'); }

function getCurrency() {
  const url = `http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_KEY}&base=USD`;
  superagent(url)
    .then(result => {
      return Object.entries(result.body.rates);
    })
}

function getSQL(request, response){
  const SQL = `SELECT * FROM countries;`;

  console.log('inside the getSQL function');
  client.query(SQL)
    .then(result => {
      let arrObj = result.rows;
      let arrArr = getCurrency();
      arrObj.forEach(country => {
        let xx = arrArr.find(element => element[0] === country.currency_code)
        country.exchange_rate = xx[1];
        country.USA_bmi = country.local_bmi/country.exchange_rate;
      })
      console.log(':)');
    })
    .catch(err => processErrors(err, response));
}


// Error Handler
function processErrors(error, response) {
  response.render('pages/error', { errorResult: error })
}
