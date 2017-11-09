var mongoose = require('mongoose')

// create schema

var categorySchema = mongoose.Schema({
	name: String,
	slug: String,
	createdDate: {
		type: Date,
		default: Date.now
	},
	createdBy: String,
	description: String
})

var Category = module.exports = mongoose.model('Category', categorySchema)
