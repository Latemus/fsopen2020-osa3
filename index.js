const express = require('express')

const mockData = require('./db.json')
const {persons} = mockData

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1><div>Check API-endpoint /persons</div>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
