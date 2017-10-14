var mongoose = require('mongoose')

// create schema

var recipeSchema = mongoose.Schema({
	title: String,
	description: String,
	photo: {type: String},
	ingredients: Object,
	directions: Object,
	categoryId: String,
	slug: String
})

var Recipe = module.exports = mongoose.model('Recipe', recipeSchema)
