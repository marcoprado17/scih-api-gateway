var express = require('express');
var router = express.Router();
const httpProxy = require('express-http-proxy');

/* GET home page. */
router.get('/api', function(req, res, next) {
  res.send("Home page da api!!!");
});

const gpsServiceProxy = httpProxy('http://gps-service');

// Proxy request
router.get('/api/account/:accountId/gps-data', (req, res, next) => {
    gpsServiceProxy(req, res, next);
})


module.exports = router;
