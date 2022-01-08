const express = require('express')

const mockData = require('./db.json')
const {persons} = mockData

const app = express()
app.use(express.json())

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


var getInfoPage = (personCount) => `
  <div>Phonebook has info for ${personCount} people</div>
  <hr/>
  <div>${new Date()}</div>
`