var express = require('express');
var router = express.Router();
const httpProxy = require('express-http-proxy');

/* Returning 200 on / to serve as health check to ingress: https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer#remarks */
router.get('/', function(req, res, next) {
  res.sendStatus(200)
});

/* GET home page. */
router.get('/api', function(req, res, next) {
  res.send("Home page da api!!!");
});

/* gps-sercice rules */
const gpsServiceProxy = httpProxy('http://gps-service');

router.post('/api/accounts/:accountId/contracts/:contractId/gps-data', (req, res, next) => {
    gpsServiceProxy(req, res, next);
})

router.get('/api/accounts/:accountId/contracts/:contractId/gps-data', (req, res, next) => {
  gpsServiceProxy(req, res, next);
  
})

module.exports = router;
