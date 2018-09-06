var express = require('express');
var router = express.Router();
const httpProxy = require('express-http-proxy');

/* GET home page. */
router.get('/api', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const userServiceProxy = httpProxy('http://localhost:3001');

// Proxy request
router.get('/users', (req, res, next) => {
  userServiceProxy(req, res, next);
})


module.exports = router;
