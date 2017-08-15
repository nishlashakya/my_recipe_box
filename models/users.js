var mongoose = require('mongoose')

// create schema

var userSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	address: String,
	email: String,
	password: String,
})

var User = module.exports = mongoose.model('User', userSchema)
