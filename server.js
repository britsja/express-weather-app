const { log } = require("console");
const express = require("express");
//Using HTTPS node module: https://nodejs.org/api/https.html#httpsgeturl-options-callback
const https = require("https");
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function() {
    console.log("Server listening on port 3000");
})

app.get("/", function(req, res) {

    res.sendFile(__dirname + "/index.html");

        
})

app.post("/", function(req, res) {
    const apiKey = '&APPID=' + process.env.API_KEY;

    const url_initial = 'https://api.openweathermap.org/data/2.5/weather?q='
    const userCity = req.body.cityName;
    const units = '&units=metric'    
    const url = url_initial + userCity + units + String(apiKey);
    console.log(url)

    https.get(url, function(response) {        

        response.on("data", function(data) {            
            const weatherData = JSON.parse(data);            
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const location = weatherData.name;
            const icon = weatherData.weather[0].icon;
            const iconUrl = "https://openweathermap.org/img/wn/";
            const iconExt = "@2x.png"
            const fullIconUrl = iconUrl + icon + iconExt;            

            res.write(`<h1>The temperature in ${location} is ${temp} degrees celsius</h1>`)
            res.write(`<h2>Weather status: ${description}</h2>`)
            res.write(`<img src=${fullIconUrl} />`)
            res.send();            
        })
    })
})



