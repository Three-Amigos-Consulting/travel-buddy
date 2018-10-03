-- BASIC STRUCTURE -- NEEDS FINE TUNING
-- TODO:

CREATE TABLE IF NOT EXISTS countries (
id SERIAL PRIMARY KEY,
country_name VARCHAR(255),
capital CHAR(50),
country_code CHAR(3),
currency_code CHAR(3),
exchange_rate NUMERIC(9,3),
local_bmi NUMERIC(9,3),
usa_bmi NUMERIC(4,2),
flag_url VARCHAR(255),
created_date BIGINT);

CREATE TABLE IF NOT EXISTS mytrips (
id SERIAL PRIMARY KEY, 
latitude NUMERIC(8, 6), 
longitude NUMERIC(9, 6), 
country foreignkey
);


-- TODO:

INSERT INTO countries
(country_name, country_code, currency_code, exchange_rate, local_bmi, usa_bmi)
VALUES
('United States', 'USA', 'USD', 1, 5.51, 5.51), 
('Switzerland', 'CHE', 'CHF', 0.983, 6.43, 6.54), 
('Sweden', 'SWE', 'SEK', 8.881, 51.78, 5.83), 
('Norway', 'NOR', 'NOK', 8.183, 42.72, 5.22), 
('Canada', 'CAN', 'CAD', 1.325, 6.72, 5.07), 
('Euro area', 'FRA', 'EUR', 0.861, 4.08, 4.74), 
('Denmark', 'DNK', 'DKK', 6.42, 30.30, 4.72), 
('Israel', 'ISR', 'ILS', 3.644, 17.05, 4.68), 
('Australia', 'AUS', 'AUD', 1.36, 6.15, 4.52), 
('Uruguay', 'URY', 'UYU', 31.155, 139.26, 4.47), 
('Brazil', 'BRA', 'BRL', 3.858, 16.98, 4.4), 
('Lebanon', 'LBN', 'LBP', 1505, 6471.50, 4.3), 
('Singapore', 'SGP', 'SGD', 1.367, 5.85, 4.28), 
('New Zealand', 'NZL', 'NZD', 1.479, 6.26, 4.23), 
('Britain', 'GBR', 'GBP', 0.757, 3.20, 4.23), 
('Columbia', 'COL', 'COP', 2863.199, 11853.64, 4.14), 
('Chile', 'CHL', 'CLP', 652.52, 2642.71, 4.05), 
('Costa Rica', 'CRI', 'CRC', 563.909, 2272.55, 4.03), 
('South Korea', 'KOR', 'KRW', 1134.217, 4570.89, 4.03), 
('United Arab Emirates', 'ARE', 'AED', 3.672, 13.99, 3.81), 
('Sri Lanka', 'LKA', 'LKR', 159.8, 581.67, 3.64), 
('Thailand', 'THA', 'THB', 33.359, 119.76, 3.59), 
('Honduras', 'HND', 'HNL', 23.922, 84.68, 3.54), 
('Japan', 'JPN', 'JPY', 112.755, 395.77, 3.51), 
('Kuwait', 'KWT', 'KWD', 0.302, 1.05, 3.47), 
('Czech Republic', 'CZE', 'CZK', 22.265, 75.70, 3.4), 
('Guatemala', 'GTM', 'GTQ', 7.49, 25.02, 3.34), 
('Croatia', 'HRV', 'HRK', 6.367, 21.20, 3.33), 
('Qatar', 'QAT', 'QAR', 3.639, 12.01, 3.3), 
('Nicaragua', 'NIC', 'NIO', 31.319, 102.10, 3.26), 
('Peru', 'PER', 'PEN', 3.268, 10.49, 3.21), 
('Saudi Arabia', 'SAU', 'SAR', 3.75, 12.00, 3.2), 
('Bahrain', 'BHR', 'BHD', 0.378, 1.19, 3.16), 
('China', 'CHN', 'CNY', 6.721, 20.84, 3.1), 
('Pakistan', 'PAK', 'PKR', 128.1, 395.83, 3.09), 
('Hungary', 'HUN', 'HUF', 278.99, 856.50, 3.07), 
('Vietnam', 'VNM', 'VND', 23048, 64995.36, 2.82), 
('Jordan', 'JOR', 'JOD', 0.708, 1.95, 2.75), 
('Poland', 'POL', 'PLN', 3.712, 10.17, 2.74), 
('Oman', 'OMN', 'OMR', 0.384, 1.05, 2.73), 
('Argentina', 'ARG', 'ARS', 27.61, 74.82, 2.71), 
('Philippines', 'PHL', 'PHP', 53.538, 140.27, 2.62), 
('Moldova', 'MDA', 'MDL', 16.613, 42.86, 2.58), 
('Mexico', 'MEX', 'MXN', 19.014, 48.87, 2.57), 
('Hong Kong', 'HKG', 'HKD', 7.849, 20.01, 2.55), 
('India', 'IND', 'INR', 68.628, 172.26, 2.51), 
('Azerbaijan', 'AZE', 'AZN', 1.699, 3.94, 2.32), 
('South Africa', 'ZAF', 'ZAR', 13.354, 30.98, 2.32), 
('Romania', 'ROU', 'RON', 4.009, 9.30, 2.32), 
('Turkey', 'TUR', 'TRY', 4.833, 11.02, 2.28), 
('Taiwan', 'TWN', 'TWD', 30.558, 69.37, 2.27), 
('Indonesia', 'IDN', 'IDR', 14405, 31546.95, 2.19), 
('Malaysia', 'MYS', 'MYR', 4.054, 8.51, 2.1), 
('Russia', 'RUS', 'RUB', 63.135, 131.95, 2.09), 
('Ukraine', 'UKR', 'UAH', 26.28, 50.19, 1.91), 
('Egypt', 'EGY', 'EGP', 17.85, 31.24, 1.75);