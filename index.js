const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
// https://github.com/expressjs/morgan#creating-new-tokens
// Define a custom token for request body data
morgan.token('body', (request) => JSON.stringify(request.body));
app.use(morgan(':method :url :status :response-time ms - :body'));


let notes = [
  {
    "id": 1,
    "content": "HTML is easy",
    "important": true
  },
  {
    "id": 2,
    "content": "Browser can execute only JavaScript",
    "important": false
  },
  {
    "id": 3,
    "content": "GET and POST are the most important methods of HTTP protocol",
    "important": true
  } 
]

app.get('/api/notes', (request, response) => {
  response.send(notes)
})

app.get('/info', (request, response) => {
  //response.send(notes)
  const date = new Date()
  let day = date.toLocaleString('en-us', { weekday: 'long' });
  let month = date.toLocaleString('en-us', { month: 'long' });
  response.send(
  `<p>Phonebook has information for ${notes.length} people</p> 
  <p> ${date} </p>`
  )
  console.log(date)
})

const generatedID = () => {
  return Math.floor(Math.random() * 1000) + 1;
}

app.post('/api/notes', (request, response) => {
  const body = request.body
  const checkName = notes.find(person => person.name === body.name)
  //console.log(checkName)
  if(!body.name || !body.number || checkName){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = {
    id: generatedID(),
    name: body.name,
    number: body.number
  }
  notes = notes.concat(person)
  response.json(person)
})

app.get('/info/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = notes.find(note => note.id === id)
  if(person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/info/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})