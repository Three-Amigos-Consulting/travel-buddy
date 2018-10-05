# Travel Buddy
**Author**: David Chambers, Andy Fields, Ryan Milton
**Version**: 1.0.0

## Overview
Full stack application to find affordable places to travel based on the exchange rate AND value of the US Dollar.

## Getting Started
To install this package on your local system:
1. Clone the repository into your local system
2. Launch ```npm -i``` in the directory of the repository.

## Architecture
This project uses the following technologies:
* JavaScript
* jQuery ```https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js```
* Node.js ```https://nodejs.org/en/```
* postgres: ```npm i pg ```
* express: ```npm i express```
* superagent: ```npm i superagent```
* dotenv: ```npm i dotenv```
* method-overide ```npm i method-overide```
* Heroku deployment: dc-af-rm-travelbuddy.herokuapp.com
* Live site: [www.travel-buddy.website](www.travel-buddy.website)

## Database SCHEMA
Database Schema can be found in [travel_budy_schema.sql](travel_budy_schema.sql)

## Change Log
#### 10-01-2018
* (DC/AF/RM) - Finsihed standup and presented concepts to approval team.
* (DC) - Setup GitHub Organization and created repo and project workflow centers
* (AF) - Began to find data on Big Mac Index, and added this data with Currency Exchange Rate data.
* (DC) - Initial scaffolding finished.  Pushed to master with development branch created.
* (RM) - API response coming back properly from rest countries API, google maps, exchange rates api, fixer.io, google places, and assisted Andy with structuring the SQL database.
#### 10-02-2018
* (DC) Finished wireframe drawings for Results/My Trips, Detail, and Index. Purchased travel-buddy.website.
* 10-02-2018
#### 10-03-2018
* (DC) - merged current Wireframe info.
* (DC/AF/RM) - Successfully created helper functions to gather data for merging current data with existing data.
* (DC/AF/RM) - Successfully merged data and updated database.
* (AF/DC) - Successfully rendered data to explore page.
* (DC) - Fixed refresh bug in explore, sorted array
* 
#### 10-04-2018
* (DC) - worked on debugging Heroku deployment after successful creation of detail render.
* (RM/AF) - 
* (AF/RM) - 
* (DC) - worked on detail layout and consistent CSS across pages
* (AF) - worked on About Us page
* (RM) - worked on a brief explanation about the Big Mac Index
#### 10-05-2018
* 
## The Big Mac Index
Currency exchange rates alone are not enough to determine the value of the US Dollar (USD) in other countries because the spending power of the local currency will vary from country to country.  This creates a need to find a common product that is consistent from country to country and do a comparison of its value in USD. 

The McDonald's Big Mac is one such item.  It is produced and packaged according to McDonald's standards, regardless of country, to maintain a consistent product.  In addition, McDonald's has a presence in the majority of the world's countries.

Beginning in 1986, and updated one to two times per year, The Economist created the Big Mac Index, which provides the value of a Big Mac in USD accross 56 countries.  We used the most recent (July 18, 2018) index to reverse engineer the cost in local country currency of a Big Mac.  

Our process calculates the value in USD based on the updated currency rates.

 ``` (Local Country Big Mac Cost) / (Local currency exchange rate with USD) = (Value of Big Mac in USD)```

Additional information and reading about the Big Mac Index can be found in the Credits and Collaborations section below.

## Credits, Collaborations, and Resources
### Consultants
* Derrick Hwang - helping us identify the Big Mac Index as a solution.
* Allie, Sam, John, Michelle, Brian, and Brook for their help with the Heroku Deployment issue.

### Resources
* The Economist - [Big Mac Index](https://www.statista.com/statistics/274326/big-mac-index-global-prices-for-a-big-mac/)
* [Fixer](fixer.io) - Currency exchange rates - we purchased the preimum package to provide the best results.
* [Rest Countries](restcountries.eu) - provided country capitals and flag URLs.
* [Google Places](https://developers.google.com/places/web-service/intro).