var express = require('express');
var router = express.Router();

var slugify = require('slugify');

var Recipes = require('../models/recipes')
var checkToken = require('../utils/checkToken')


router.post('/addRecipe', checkToken, function (req, res, next) {
	var slug = slugify(req.body.title) // some-string
	var recipe = new Recipes ({
		title: req.body.title,
		description: req.body.description,
		photo: req.body.photo,
		ingredients: req.body.ingredients,
		directions: req.body.directions,
		slug,
	});
	// var recipe = new Recipes (req.body, slug);
	recipe.save(function (err, doc) {
		console.log('lllllllllllllllllll', doc);
		res.json({action: 'added', doc})
	})
});


module.exports = router;
