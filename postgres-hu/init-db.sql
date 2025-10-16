-- Létrehozza a bufe felhasználót
CREATE USER bufe WITH PASSWORD 'a';

-- Létrehozza a magyar adatbázist a bufe user tulajdonában
CREATE DATABASE bufe
  WITH OWNER = bufe
       ENCODING = 'UTF8'
       LC_COLLATE = 'hu_HU.UTF-8'
       LC_CTYPE = 'hu_HU.UTF-8'
       TEMPLATE = template0;

-- Jogok
GRANT ALL PRIVILEGES ON DATABASE bufe TO bufe;
