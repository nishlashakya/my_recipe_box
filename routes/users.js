var express = require('express');
var router = express.Router();
var Users = require('../models/users');

/* GET users listing. */
router.get('/login', function(req, res) {
  res.render('login');
});
router.get('/', function(req, res) {
	console.log('jjjjjjjjjjjjjjjjjjjjjjjj');
  res.render('index', { title: 'Express' });
});

router.post('/login', function(req, res) {
	console.log('fromhereeeeeeeeeee');
	if(req.body.email && req.body.password) {
          Users.find({email: req.body.email, password: req.body.password}, function(err, docs) {
              if(err) {
                  console.log('errorrrrr');
              }
              if(docs.length) {
                console.log('successs............');
              }else {
				console.log('no user.............');
              }
          });
    }
});

module.exports = router;
