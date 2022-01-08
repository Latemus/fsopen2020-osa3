const express = require('express')
const morgan = require('morgan')

const mockData = require('./db.json')
let {persons} = mockData

const app = express()
app.use(express.json())
app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1><div>Check API-endpoint /persons</div>')
})

app.get('/info', (req, res) => {
  res.send(getInfoPage(persons.length))
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (!person) {
    return response.status(404).json({ error: `Person not found with id ${id}` })
  }
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id != id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

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