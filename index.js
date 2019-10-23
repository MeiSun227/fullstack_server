const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(bodyParser.json())
app.use(morgan(':method :url :status :response-time ms :body'));
app.use(express.static('build'))
let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }

]


app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/info', (request, response) => {
    const totalAmountPersons = persons.length
    const date = new Date()
    const resp = `Phonebook has  info of ${totalAmountPersons} people \n ${date}`
    response.end(resp)

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
    person ? response.json(person) : response.status(404).end()
})

app.delete('/api/person/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const jsonPersonID = Math.floor(Math.random() * Math.floor(100))
    const person = request.body
    person.id = jsonPersonID

    const names = persons.map(person => person.name)
    if (names.includes(person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } if (person.name === null || person.number === null) {
        return response.status(400).json({
            error: 'name or number can not be empty'
        })
    }

    persons = persons.concat(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})