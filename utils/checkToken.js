var jwt = require('jsonwebtoken');


function checkToken(req, res, next) {

	jwt.verify(req.headers['authorization'], 'secret', function(err, decoded) {
		if (err) {
			res.json({verify: false})
		} else {
			next();
		}
	});
}

module.exports = checkToken;
