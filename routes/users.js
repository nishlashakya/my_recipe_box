const express = require('express');
const router = express.Router();

const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const checkToken = require('../utils/checkToken');

const saltRounds = 10;

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
		user: 'nishla@rumsan.com',
		pass: 'Nishla123'
  }
}));

var mailOptions = {
  from: 'nishla@rumsan.com',
  to: 'nishlashakya2@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'hello from the other email'
};

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
			const passwordChangetoken = Math.random().toString(36).substring(7);
			const passwordChangetokenExpiration = Date.now() + 86400000;
			doc[0].update({
				$set: {
					passwordChangetoken,
					passwordChangetokenExpiration
				}},
				{new: true},
				function (err, user) {
				res.json({successs: true, message: 'Password recovery procedure has been emailed to you'})
				transporter.sendMail(mailOptions, function(error, info){
				  if (error) {
				    console.log(error);
				  } else {
				    console.log('Email sent: ' + info.response);
				  }
				});
				//send email with link to reset password
			});
		} else {
			res.json({message: 'email id not found'})

		}
	})
});

router.get('/reset-password/:token', function (req, res, next) {
	Users.findOne({ passwordChangetoken: req.params.token }, (err, doc) => {
		if(err) return next(err);
		if (doc) {
			if (doc.passwordChangetokenExpiration > Date.now()) {
				res.json({ action: 'checkToken', success: true , message: 'token verified'});
			} else {
				res.json({action: 'checkToken', successs: false, message: 'expired token'})
			}
		} else {
			res.json({action: 'checkToken', successs: false, message: 'invalid token'});
		}
	});
});

router.post('/reset-password', function (req, res) {
	Users.findOne({ passwordChangetoken: req.body.passwordChangetoken }, (err, user) => {
		if (user) {
			if (user.passwordChangetokenExpiration > Date.now()) {
				bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
					user.update({$set: {password: hash}}, {new: true}, function (err, data) {
						res.json({action: 'reset password', successs: true, message: 'Password successfully changed'})
					});
				});
			} else {
				res.json({action: 'reset password', successs: false, message: 'expired token'})
			}
		} else {
			res.json({action: 'reset password', successs: false, message: 'invalid token'})
		}
	});
});

router.post('/change-password', checkToken, function (req, res, next) {
	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
		Users.findOneAndUpdate({_id: req.decoded._doc._id}, {$set: {password: hash}}, {new: true}, function (err, data) {
			if (err) return next(err);
			res.json({action: 'change-password', successs: true, message: 'password changed successfully'})
		});
	});
})

router.post('/register', function(req, res) {
	const myPlaintextPassword = req.body.password;

	bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
		var user = new Users({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			address: req.body.address,
			email: req.body.email,
			password: hash,

		});
		let mailOptions = {
			from: 'nishla@rumsan.com',
		  to: req.body.email,
		  subject: 'Welcome to Recipe box',
		  text: `Hello ${req.body.firstName}, Welcome to Recipe box.`
		}
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
		user.save(function(err, doc) {
			if(err) return next(err);
			res.json(doc);
		});
	});

});

router.post('/login', function(req, res, next) {

	if(req.body.email && req.body.password) {
		Users.findOne({email: req.body.email}, function(err, doc) {
			if(err) {
				return next(Error('User not found'));
			}
			bcrypt.compare(req.body.password, doc.password, function(err, loginSuccess) {
				if(loginSuccess) {
					var token = jwt.sign(doc, 'secret', { expiresIn: 60 * 60 });
					res.json(doc);
				} else {
					return next(Error('Invalid username or password'));
				}
			});
		});
	} else {
			return next(Error('Please enter your email and password'));
	}
});

module.exports = router;
