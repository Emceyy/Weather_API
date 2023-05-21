const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require('dotenv').config();

// Rest of your application code


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static("public"));

app.post("/", function(req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;;
  const unit = "metric";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      //console.log(weatherData);
      // Render the weather.ejs file and pass the data as variables
      res.render("weather", {
        cityName: req.body.cityName,
        weatherDescription: weatherDescription,
        temp: temp,
        imageURL: imageURL
      });
    });
  });
});

app.post("/weather", function(req, res  ) {
  res.redirect("/");
});

app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});
