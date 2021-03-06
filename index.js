const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const showdown  = require('showdown')
const Person = require('./model/person')

// Database connection
const dbUtils = require('./database/mongo.js')
dbUtils.connectToDatabase()

// Define express server and use middleware
const app = express()
const PORT = process.env.PORT || 3001

// Add static frontend build. Uncomment to use
// app.use(express.static('frontend-build'))

app.use(cors())
app.use(express.json())
// Configure and use morgan in tiny configuration with added JSON body content print
morgan.token('body-content', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body-content'))

// Import README.md to add it to the root route
const parseMD = require('parse-md').default
const fileContents = fs.readFileSync('./README.md', 'utf8')
const { content } = parseMD(fileContents)
// Convert .md to html
const converter = new showdown.Converter()
const html = converter.makeHtml(content)
const basePath = '/api/persons'


// All routes
app.get('/', (req, res) => {
  res.send(`${html}`)
})

app.get('/info', async (req, res) => {
  let persons = await Person.find()
  res.send(getInfoPage(persons.length))
})

app.get(basePath, (req, res, next) => {
  Person.find()
    .then(result => res.json(result))
    .catch(error => next(error))
})

app.get(`${basePath}/:id`, async (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => response.json(person))
    .catch(error => next(error))
})

app.delete(`${basePath}/:id`, async (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      return response.status(204).end()
    })
    .catch(error => next(error))
})

app.post(basePath, async (request, response, next) => {
  const { body } = request
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save()
    .then(person => {
      console.log(`Added ${person.name} number ${person.number} to phonebook`)
      return response.json(person)
    })
    .catch(error => next(error))
})

app.put(`${basePath}/:id`, (request, response, next) => {
  const body = request.body
  Person.findByIdAndUpdate(
    request.params.id,
    { name: body.name, number: body.number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

var getInfoPage = personCount => `
  <div>Phonebook has info for ${personCount} people</div>
  <hr/>
  <div>${new Date()}</div>
`

const errorHandler = (error, request, response, next) => {
  console.error(`[ERROR] ${error.message}`)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// Error handler middleware
app.use(errorHandler)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}. In local development open localhost:${PORT}`)
})