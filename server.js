'strict';

// ===========================
// Build out the initial server
// ===========================

//Required Dependencies
const express = require('express');
// const superagent = require('superagent');
// const pg = require('pg');

require('dotenv').config();


//Create an instance of express in the variable app
const app = express();

// Establish the PORT number for the server
const PORT = process.env.PORT || 3000;

// Tell the server to get files from the public folder
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//Start database connection
// const client = new pg.Client(process.env.DATABASE_URL);
// client.connect();

// client.on('error', err => console.error(err));

// Tell express to use EJS files
app.set('view engine', 'ejs');

// ++++++++++++++++
// Routes to listen
// ++++++++++++++++

// index.ejs
app.get('/', renderHomePage);

//Set the catch all route
app.get('*', (request, response) => response.status(404).render('pages/404-error.ejs'));

// Activate the server
app.listen(PORT, () => console.log(`(TRAVEL BUDDY) listening on: ${PORT}`));


// +++++++++++++++++++++++++++++++++
// Helper functions
// +++++++++++++++++++++++++++++++++

function renderHomePage(request, response) { response.render('index'); }


// // Error Handler
// function processErrors(error, response) {
//     response.render('pages/error', { errorResult: error })
// }


