var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nconf = require('nconf');

nconf
    .argv()
    .env();

let env = nconf.get("NODE_ENV") || "prod";

if(env == "prod"){
    nconf.file("./configs/prodConfigs.json");
}
else {
    nconf.file("./configs/devConfigs.json");
}

var router = require('./routes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({"error": err.message});
});

// function tempTestUrl(url){
//     const axios = require('axios');
//     axios.get(url, {
//     })
//     .then(function (response) {
//         console.log(`sucesso para ${url}`);
//         // console.log(response.data);
//     })
//     .catch(function (err) {
//         console.log(`erro para ${url} | ${err.message}`);
//         // console.error(err.message);
//     });
// }

// setTimeout(() => {
//     tempTestUrl("http://35.239.45.68:82/");
//     tempTestUrl("http://gps-service:82/");
//     tempTestUrl("http://gps-service/");
//     tempTestUrl("gps-service/");
//     tempTestUrl("gps-service:82/");
//     tempTestUrl("http://localhost:8282/");

//     tempTestUrl("http://gpsservice:83/");
//     tempTestUrl("http://gpsservice/");
//     tempTestUrl("gpsservice/");
//     tempTestUrl("gpsservice:83/");

//     tempTestUrl("http://scihmachine_gpsservice_1:83/");
//     tempTestUrl("http://scihmachine_gpsservice_1/");
//     tempTestUrl("scihmachine_gpsservice_1/");
//     tempTestUrl("scihmachine_gpsservice_1:83/");

//     tempTestUrl("http://gps:82/");
//     tempTestUrl("http://gps/");
//     tempTestUrl("gps/");
//     tempTestUrl("gps:82/");

//     tempTestUrl("http://gps-service_1:82/");
//     tempTestUrl("http://gps-service_1/");
//     tempTestUrl("gps-service_1/");
//     tempTestUrl("gps-service_1:82/");
// }, 10000);

module.exports = app;
