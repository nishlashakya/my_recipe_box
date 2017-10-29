var express = require('express');
var router = express.Router();

var slugify = require('slugify');
const bluebird = require('bluebird');
const coroutine = bluebird.coroutine;

var Recipes = require('../models/recipes')
var checkToken = require('../utils/checkToken')

router.post('/add', checkToken, coroutine(function* (req, res, next) {
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
		res.json(savedRecipe)
  } catch (e) {
		return next(e);
	}
}));

router.delete('/:id', coroutine(function* (req, res, next) {
	try {
		yield Recipes.find({_id: req.params.id}).remove();
		res.send(true);
	} catch (e) {
		return next(e);
	}
}));

router.get('/view/:id', coroutine(function* (req, res, next) {
	try {
		const recipe = yield Recipes.find({_id: req.params.id});
		res.json(recipe);
	} catch (e) {
		return next(e);
	}
}));

router.get('/view', coroutine(function* (req, res, next) {
	try {
		const allRecipe = yield Recipes.find();
		res.json(allRecipe);
	} catch (e) {
		return next(e);
	}
}))

router.put('/edit/:id', checkToken, coroutine(function* (req, res, next) {
	try {
		const updatedRecipe = yield Recipes.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true});
		res.json(updatedRecipe);
	} catch (e) {
		return next(e);
	}
}));

router.get('/edit/:id', checkToken, coroutine(function* (req, res, next) {
	try {
		const updateRecipe = yield Recipes.findOne({_id: req.params.id});
		res.json(updateRecipe);
	} catch (e) {
		return next(e);
	}
}))

module.exports = router;
