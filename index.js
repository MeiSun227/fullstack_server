const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config()

app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(bodyParser.json())
app.use(morgan(':method :url :status :response-time ms :body'));
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/info', (request, response) => {
    const totalAmountPersons = persons.length
    const date = new Date()
    const resp = `Phonebook has  info of ${totalAmountPersons} people \n ${date}`
    response.end(resp)

})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const jsonPersonID = Math.floor(Math.random() * Math.floor(100))
    const person = request.body
    person.id = jsonPersonID

    if (person.name === null || person.number === null) {
        return response.status(400).json({
            error: 'name or number can not be empty'
        })
    }
    const personModel = new Person({
        name: person.name,
        number: person.number,
    })
    personModel.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})