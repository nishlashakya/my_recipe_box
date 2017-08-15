var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	console.log('jjjjjjjjjjjjjjjjjjjjjjjj');
  res.render('index', { title: 'Express' });
});

router.post('/login', function(req, res) {
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

router.get('/signup', function(req, res) {
  res.render('signup');
});

module.exports = router;
