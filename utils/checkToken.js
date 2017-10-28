var jwt = require('jsonwebtoken');


function checkToken(req, res, next) {
	const token = req.headers['authorization']
	jwt.verify(token, 'secret', function(err, decoded) {
		if (err) {
			res.json({verify: false})
		} else {
			req.decoded = decoded;
			next();
		}
	});
}

module.exports = checkToken;
