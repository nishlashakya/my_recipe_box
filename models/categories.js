var mongoose = require('mongoose')

// create schema

var categorySchema = mongoose.Schema({
	name: String,
	slug: String
	createdDate: String,
	createdBy: String,
})

var Category = module.exports = mongoose.model('Category', categorySchema)
