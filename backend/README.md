This is Document File of Backend code
if You want to start the project just

I always save all my secrets in an ENV file, but I want to share them with you, so that's why I enter all my secrets in code directly.

If you want a tokenized link, just add the authenticateJWT function.

API Routes

1. Route to pull data for specific devices. :- specific.js
   url :- http://localhost:5000/data/specificData?devices=DeviceB

2. Route to pull pm1, pm2.5, and pm10 values separately for all specified device :- customData.js
   url :- http://localhost:5000/data/custom?devices=DeviceA

3. Add a way to filter the data according to a time-range.
   url :- http://localhost:5000/data/specific/:DeviceA/21-03-19_09-08-28/21-03-19_09-10-00

4. Route to upload bulk data from a given excel sheet. The input data should have the same
   columns as the given csv.:- uploadRoutes.js
   url :- http://localhost:5000/

5. Route to GET data for a specific device START :- getSpecificData.js
   url :- http://localhost:5000/data/val?h=Shubham
   You just change value of {h,w,p1,p25,p10} and you can get custom output

To start Application
copy code to your folder
cd backend
npm install
node app.js/npm run server

Also, I attached a Postman API file. You can use and check APIs.

I try My Best Thank You
