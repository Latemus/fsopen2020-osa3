const mongoose = require('mongoose')


// Define schema used
const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

personSchema.set('toJSON', {
	transform: (document, returnObject) => {
		returnObject.id = returnObject._id.toString()
		delete returnObject._id
		delete returnObject.__v
	}
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person