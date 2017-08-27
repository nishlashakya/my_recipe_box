var express = require('express');
var router = express.Router();

var Users = require('../models/users');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/login', function(req, res) {
  res.render('login');
});
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.post('/check-email', function (req, res) {
	Users.find({email: req.body.email}, function(err, doc) {
		if(doc[0]) {
			var passwordChangetoken = Math.random().toString(36).substring(7);
			doc[0].update({$set: passwordChangetoken}, {new: true}, function (err, user) {
				res.json({successs: true, message: 'Password recovery procedure has been emailed to you', passwordChangetoken})
				//send email with link to reset password
			});
		} else {
			res.json({message: 'email id not found'})

		}
	})
});

router.get('/reset-password/:token', function (req, res) {
	jwt.verify(req.params.token, 'secret', function(err, decoded) {
		if (decoded) {
			res.json({action: 'checkToken', successs: true});
			// render to password reset page
		} else {
			res.json({action: 'checkToken', successs: false, message: 'invalid token'});
		}
	});
});

router.post('/reset-password', function (req, res) {
	Users.findOneAndUpdate({passwordChangetoken: req.body.passwordChangetoken}, {$set: {password: req.body.password}}, {new: true}, function (err, data) {
		if (data) {
			res.json({action: 'reset password', successs: true, message: 'Password successfully changed'})
		} else {
			res.json({action: 'reset password', successs: false, message: 'invalid token'})
		}
	})
})

router.post('/register', function(req, res) {
	const saltRounds = 10;
	const myPlaintextPassword = req.body.password;

	bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
		var user = new Users({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			address: req.body.address,
			email: req.body.email,
			password: hash,

		});
		user.save(function(err, doc) {
			if(err) throw err
			res.json({register: true, doc});
		});
	});

});

router.post('/login', function(req, res) {

	if(req.body.email && req.body.password) {
		Users.find({email: req.body.email}, function(err, docs) {
			if(err) {
				res.json({successs: false, result: {message: 'User not found'}})
			}
			bcrypt.compare(req.body.password, docs[0].password, function(err, loginSuccess) {
				if(loginSuccess) {
					var token = jwt.sign(docs[0], 'secret', { expiresIn: 60 * 60 });
					res.json({successs: true, result: {message: 'Login Successful!', token, user: docs[0]}});
				} else {
					res.json({successs: false, result: {message: 'Password Incorrect'}})
				}
			});
		});
	} else {
			res.json({result: {message: 'Please enter your email and password'}})
	}
});

module.exports = router;
