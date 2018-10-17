var express = require('express');
var router = express.Router();
const httpProxy = require('express-http-proxy');
const { body, param, validationResult } = require('express-validator/check');

/* Returning 200 on / to serve as health check to ingress: https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer#remarks */
router.get('/', function(req, res, next) {
  res.sendStatus(200)
});

/* GET home page. */
router.get('/api', function(req, res, next) {
  res.send("Home page da api!!!");
});

/* gps-service rules */
const gpsServiceProxy = httpProxy('http://gps-service');

router.post('/api/accounts/:accountId/contracts/:contractId/gps-data', [
  body("data.encryptedGpsData").isString(),
  body("data.creationUnixTimestamp").isNumeric(),
  body("from").isString(),
  body("v").isNumeric(),
  body("r.type").equals("Buffer"),
  body("r.data").isArray(),
  body("r.data.*").isNumeric(),
  body("s.type").equals("Buffer"),
  body("s.data").isArray(),
  body("s.data.*").isNumeric(),
  param("accountId").isString(),
  param("contractId").isString()
],(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    gpsServiceProxy(req, res, next);
});

router.get('/api/accounts/:accountId/contracts/:contractId/gps-data', (req, res, next) => {
  gpsServiceProxy(req, res, next);
});

module.exports = router;
