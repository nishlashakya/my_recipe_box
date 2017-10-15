var express = require('express');
var router = express.Router();

var slugify = require('slugify');
const bluebird = require('bluebird');
const coroutine = bluebird.coroutine;

var Recipes = require('../models/recipes')
var checkToken = require('../utils/checkToken')

router.post('/addRecipe', coroutine(function* (req, res, next) {
	var slug = slugify(req.body.title)
	var recipe = new Recipes ({
		title: req.body.title,
		description: req.body.description,
		photo: req.body.photo,
		ingredients: req.body.ingredients,
		directions: req.body.directions,
		slug,
	});

	try {
		const savedRecipe = yield recipe.save();
		res.json({ action: 'add', doc: savedRecipe })
  } catch (e) {
		throw Error(e)
	}
}));

router.delete('/:id', checkToken, coroutine(function* (req, res, next) {
	try {
		yield Recipes.find({_id: req.params.id}).remove();
		res.json({action: 'delete', successs: true});
	} catch (e) {
		return next(e);
	}
}));

router.get('/viewRecipeDetail/:id', coroutine(function* (req, res, next) {
	try {
		const recipe = yield Recipes.find({_id: req.params.id});
		res.json({action: 'view', successs: true, recipe});
	} catch (e) {
		return next(e);
	}
}));

router.put('/editRecipe/:id', coroutine(function* (req, res, next) {
	try {
		const updatedRecipe = yield Recipes.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true});
		res.json({action: 'update', successs: true, doc: updatedRecipe});
	} catch (e) {
		return next(e);
	}
}));
// router.put('/editRecipe/:id', checkToken, function (req, res, next) {
// 	Recipes.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}, function (err, doc) {
// 		if(err) {
// 			res.json({action: 'update', successs: false});
// 		} else {
// 			console.log(',,,,,,,,,,,,,,,,', req.body);
// 			res.json({action: 'update', successs:true, doc})
// 		}
// 	})
// })


module.exports = router;
