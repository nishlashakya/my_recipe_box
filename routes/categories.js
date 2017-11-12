var express = require('express');
var router = express.Router();

const Categories = require('../models/categories');

var checkToken = require('../utils/checkToken')

const slugify = require('slugify');
const bluebird = require('bluebird');
const coroutine = bluebird.coroutine;


/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', coroutine(function* (req, res, next) {
  const categories = yield Categories.find({});
  res.json(categories);
}))

router.post('/', checkToken, coroutine(function* (req, res, next) {
	const slug = slugify(req.body.name)
	var category = new Categories ({
		name: req.body.name,
		slug,
    description: req.body.description,
		createdDate: req.body.date,
		createdBy: req.decoded._doc._id,
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
			id: req.params.id
		});
	} catch (e) {
		throw Error(e)
	}
}));

router.get('/:id', function (req, res) {
  Categories.findOne({_id: req.params.id}, function (err, category) {
    res.json(category);
  })
})

router.put('/:id', checkToken, function (req, res) {
	Categories.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}, function (err, doc) {
		res.json(doc);
	})
})

module.exports = router;
