// Obtenção das dependências
var express = require('express');
var router = express.Router();
const httpProxy = require('express-http-proxy');
const { body, param, validationResult } = require('express-validator/check');
var nconf = require('nconf');
const ethereumjs = require('ethereumjs-util');
const wrapAsync = require('./wrap-assync');
const assert = require('assert');

// Returning 200 on / to serve as health check to ingress
// https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer#remarks
router.get('/', function(req, res, next) {
  res.sendStatus(200)
});

/* GET home page. */
router.get('/api', function(req, res, next) {
  res.send("Home page da api!!!");
});

/* gps-service rules */
const gpsServiceProxy = httpProxy(nconf.get("gpsServiceHost"));

router.post('/api/accounts/:accountId/contracts/:contractId/gps-data', [
  // Validando o corpo do request
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
], wrapAsync(async (req, res, next) => {
    // Se ocorreu algum erro de validação, será retornado o código http 400
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // // Validando a assinatura ECDSA
    // let dataHash = await ethereumjs.sha3(JSON.stringify(req.body.data));
    
    // let r = new Buffer(req.body.r.data);
    // let s = new Buffer(req.body.s.data);

    // try {
    //   const validSign = ethereumjs.isValidSignature(req.body.v, r, s);
    //   const pubKey  = ethereumjs.ecrecover(
    //     ethereumjs.toBuffer(dataHash), req.body.v, r, s);
    //   const addrBuf = ethereumjs.pubToAddress(pubKey);
    //   const addr    = ethereumjs.bufferToHex(addrBuf);
    //   assert(validSign);
    //   assert.equal(req.body.from, addr)
    // }
    // catch(err) {
    //   // Caso a assinatura seja inválida, será retornado o código http 400
    //   return res.status(400).json({ error: err.message });
    // }
    
    // Enviando o dado para GPS Service
    gpsServiceProxy(req, res, next);
}));

// Rota utilizada para obtenção dos dados do GPS
router.get('/api/accounts/:accountId/contracts/:contractId/gps-data', 
(req, res, next) => {
  gpsServiceProxy(req, res, next);
});

module.exports = router;
