var mongoose = require('mongoose')

// create schema

var recipeSchema = mongoose.Schema({
	title: String,
	description: String,
	photo: {type: String},
	ingredients: String,
	directions: String,
})

var Recipe = module.exports = mongoose.model('Recipe', recipeSchema)
