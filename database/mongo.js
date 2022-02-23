const mongoose = require('mongoose')
const dbConfig = require('./dbConfig')
require('dotenv').config()

const connectToDatabase = () => {
  // Do nothing if connection alredy ok
  if (!mongoose.connection || mongoose.connection.readyState === 0) {
    mongoose.connect(getDbUrl(), getDbAdditionalConfig()).then(() => {
      console.log('Successfully connected to the database')
      mongoose.connection.on('error', error => handleDatabaseError(error))
    }).catch(error => {
      handleDatabaseError(error)
      process.exit()
    })
  }
}

const getDbUrl = () => {
  const dbUrlAndPort = process.env.DB_URL_AND_PORT || dbConfig.url || 'mongodb://mongo:27017'
  console.log(`Database connection url: ${dbUrlAndPort}`)
  return dbUrlAndPort
}

const getDbAdditionalConfig = () => {
  return {
    useNewUrlParser: true,
    user: process.env.DB_USER || dbConfig.user,
    pass: process.argv[2] || process.env.DB_PASS || dbConfig.pwd
  }
}

const handleDatabaseError = error => {
  console.log('Error with Mongo database:')
  console.log(error)
}

module.exports = { connectToDatabase }