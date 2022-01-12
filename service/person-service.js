const { response } = require('express')
const mongoose = require('mongoose')
const Person = require('../model/person')

const getAll = () => {
   return Person.find()
}

const getById = id => {
   return Person.find({ _id: id })
}

const addNewPerson = personData => {
   // if (!nameIsUnique(personData)) {
   //    response.status(400).json({ error: `Name is allready in phone book. Name must be unique` })
   // }
   // if (!userIsValid(personData)) {
   //    return response.status(400).json({ error: `Name and number are required for a person` })
   // }

   const person = new Person({
      name: personData.name,
      number: personData.number,
   })

	const newPerson = person.save()
   console.log(`Added ${person.name} number ${person.number} to phonebook`)
	return getById(newPerson._id)
}

const deletePerson = id => {
   return Person.deleteOne({ _id: id })
}

// Helper functions
// var nameIsUnique = person => {
//    return getAllByName(person.name).length == 0
// }
 
// var userIsValid = user => {
//    return user && user.name && user.name.length > 0 && user.number && user.number.length > 0 
// }

module.exports = { getAll, getById, addNewPerson, deletePerson }