const mongoose = require('mongoose')
const dbConfig = require('./dbConfig')
require('dotenv').config()


// Define schema used
const personSchema = new mongoose.Schema({
	name: String,
	number: String
})
const Person = mongoose.model('Person', personSchema)


const main = () => {
	if (process.argv.length < 3) {
		console.log('Give database password, person\'s name and phone number as arguments')
		process.exit(1)
	}

	connectToDatabase()

	if (process.argv.length === 3) {
		return printAllPersons()
	} else if (process.argv.length === 5) {
		const personsName = process.argv[3]
		const personsNumber = process.argv[4]
	
		const person = new Person({
			name: personsName,
			number: personsNumber,
		})
	
		addNewPerson(person)
	} else {
		console.log('wrong number of arguments. start with node mongo.js [password*] [personName] [personNumber]')
		process.exit(1)
	}
}



var connectToDatabase = () => {
	mongoose.Promise = global.Promise;
	const dbUrlAndPort = process.env.DB_URL_AND_PORT || dbConfig.url
	const additionalConfig = {
		useNewUrlParser: true,
		user: process.env.DB_USER || dbConfig.user,
		pass: process.argv[2] || process.env.DB_PASS || dbConfig.pwd
	}
	mongoose.connect(dbUrlAndPort, additionalConfig).then(() => {
			console.log('Successfully connected to the database');
	}).catch(err => {
			console.log('Error connecting to the database');
			console.log(err)
			process.exit();
	});
}

var printAllPersons = () => {
	Person.find({}).then(result => {
		if (result.length === 0) {
			console.log('No persons saved to the database')
		} else {
			console.log('Phonebook:');
			result.forEach(person => {
				console.log(`${person.name} ${person.number}`)
			})
		}
		mongoose.connection.close()
	})
}

var addNewPerson = person => {
	person.save().then(person => {
		console.log(`Added ${person.name} number ${person.number} to phonebook`)
		mongoose.connection.close()
	})
}

main()