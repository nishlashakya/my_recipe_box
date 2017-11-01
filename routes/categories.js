var express = require('express');
var router = express.Router();

const Categories = require('../models/categories');

var checkToken = require('../utils/checkToken')

const slugify = require('slugify');
const bluebird = require('bluebird');
const coroutine = bluebird.coroutine;


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/add', coroutine(function* (req, res, next) {
  console.log('mmmmmmmmmmmmmmmmm...........', req.body);
	const slug = slugify(req.body.name)
	var category = new Categories ({
		name: req.body.name,
		slug,
    description: req.body.description,
		createdDate: req.body.date,
		// createdBy: req.decoded._doc.firstName,
		// createdBy: req.body.createdBy,
	});
	try {
		var category = yield category.save()
		res.json(category);
	} catch (e) {
		throw Error(e)
	}
}));

router.delete('/:id', coroutine(function* (req, res) {
	try {
		yield Categories.find({_id: req.params.id}).remove();
		res.json({
			action: 'delete category',
			successs:true
		});
	} catch (e) {
		throw Error(e)
	}
}));

	router.post('/edit-category/:id', function (req, res) {
		Categories.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}, function (err, doc) {
			res.json({
				action: 'edit category',
				successs: true
			})
		})
	})

module.exports = router;
