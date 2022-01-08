const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const showdown  = require('showdown')

// Import mock data
const mockData = require('./db.json')
let {persons} = mockData

// Define express server and use middleware
const app = express()
app.use(express.static('frontend-build'))
app.use(cors())
app.use(express.json())

// Configure and use morgan in tiny configuration with added JSON body content print
morgan.token('body-content', (req, res) => JSON.stringify(req.body))
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

app.get('/info', (req, res) => {
  res.send(getInfoPage(persons.length))
})

app.get(basePath, (req, res) => {
  res.json(persons)
})

app.get(`${basePath}/:id`, (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (!person) {
    return response.status(404).json({ error: `Person not found with id ${id}` })
  }
  response.json(person)
})

app.delete(`${basePath}/:id`, (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id != id)
  response.status(204).end()
})

app.post(basePath, (request, response) => {
  const {body} = request  
  if (!nameIsUnique(body)) {
    return response.status(400).json({ error: `Name is allready in phone book. Name must be unique` })
  }
  if (!userIsValid(body)) {
    return response.status(400).json({ error: `Name and number are required for a person` })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons.push(person)
  return response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Helper functions
var nameIsUnique = person => {
  return !persons.some(u => u.name === person.name)
}

var userIsValid = user => {
  return user && user.name && user.name.length > 0 && user.number && user.number.length > 0 
}

var generateId = () => {
  // if (persons.length === 0) {
  //   return 0
  // }
  // return Math.max( ...persons.map(p => p.id)) + 1

  // Math.Random was declared in the exercise
  return Math.round(Math.random() * 100000)
}

var getInfoPage = (personCount) => `
  <div>Phonebook has info for ${personCount} people</div>
  <hr/>
  <div>${new Date()}</div>
`