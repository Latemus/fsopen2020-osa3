const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const showdown  = require('showdown')
const personService = require('./service/person-service.js')

// Database connection
const dbUtils = require('./database/mongo.js')
dbUtils.connectToDatabase()

// Define express server and use middleware
const app = express()
const PORT = process.env.PORT || 3001
app.use(cors())
app.use(express.json())

// Add static frontend build
// app.use(express.static('frontend-build'))

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
  res.send(getInfoPage(personService.getAll().length))
})

app.get(basePath, (req, res) => {
  personService.getAll().then(result => {
    return res.json(result)
  })
})

// Tämäkin toimiva tapa, mutta yllä oleva todennäköisesti vähemmän virhealtis
// app.get(basePath, async (req, res) => {
//   res.json(await personService.getAll())
// })

app.get(`${basePath}/:id`, async (request, response) => {
  const person = await personService.getById(request.params.id)
  if (!person) {
    return response.status(404).json({ error: `Person not found with id ${request.params.id}` })
  }
  return response.json(person)
})

app.delete(`${basePath}/:id`, async (request, response) => {
  await personService.deletePerson(request.params.id)
  return response.status(204).end()
})

app.post(basePath, async (request, response) => {
  const {body} = request
  const person = await personService.addNewPerson(body)
  return response.json(person)
})


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}. In local development open localhost:${PORT}`)
})

var getInfoPage = (personCount) => `
  <div>Phonebook has info for ${personCount} people</div>
  <hr/>
  <div>${new Date()}</div>
`