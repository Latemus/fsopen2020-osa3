const mongoose = require('mongoose')

const numberValidator = number => /\d{2}-\d{6}\d*/.test(number) || /\d{3}-\d{5}\d*/.test(number)

// Define schema used
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: numberValidator,
      message: 'Number must be at least 8 numbers long. It shoud start with 2 or 3 numbers followed by dash (-) and the rest'
    }
  }
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