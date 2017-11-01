import jwt from 'jsonwebtoken';

export default function checkToken(req, res, next) {
	const token = req.headers['authorization']
	jwt.verify(token, 'secret', function(err, decoded) {
		if (err) {
			res.send(401);
		} else {
			req.decoded = decoded;
			next();
		}
	});
}
