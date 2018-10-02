-- BASIC STRUCTURE -- NEEDS FINE TUNING
-- TODO:
CREATE TABLE IF NOT EXISTS country (
id SERIAL PRIMARY KEY,
country VARCHAR(255),
currencycode CHAR(3),
rate NUMERIC(9,3),
big-mac in local currency NUMERIC(9,3),
big-mac-idx cost / rate = usd NUMERIC(4,2)
);

CREATE TABLE IF NOT EXISTS mytrips (
id SERIAL PRIMARY KEY,
latitude NUMERIC(8,6),
longitude NUMERIC(9,6),
country foreignkey
);


-- TODO:
-- USE THIS FORMAT FOR CREATING THE COUNTRY TABLE
INSERT INTO <table> (<column 1>, <column 2>, ...) 
             VALUES 
                    (<value 1>, <value 2>, ...),
                    (<value 1>, <value 2>, ...),
                    (<value 1>, <value 2>, ...);