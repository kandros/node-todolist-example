const express = require('express')
const bodyParser = require('body-parser')

const PORT = 5000

const isTest = process.env.NODE_ENV === 'test'

exports.start = async function (port, { db }) {
  const { models } = db

  const app = express()

  app.use(bodyParser.json())

  const notFoundError = (response, id) => {
    response.status(404).send({
      message: `todo with ${id} not found`
    })
  }
  const getTodoById = id => models.Todo.findById(id)

  app.get('/todos', async (request, response) => {
    const todos = await models.Todo.findAll()
    response.send(todos)
  })

  app.get('/todos/:id', async (request, response) => {
    const id = request.params.id
    const todo = await getTodoById(id)

    if (!todo) {
      return notFoundError(response, id)
    }

    response.status(200).send(todo)
  })

  app.post('/todos', async (request, response) => {
    const text = request.body.text

    if (!text) {
      response.status(400).send({
        message: 'text is required'
      })
      return
    }

    const todo = await models.Todo.create({
      text
    })

    response.status(201)
    response.send(todo)
  })

  app.patch('/todos/:id', async (request, response) => {
    const id = request.params.id
    const { text, completed } = request.body

    const todo = await getTodoById(id)

    if (!todo) {
      return notFoundError(response, id)
    }

    const toUpdate = { text, completed }

    await todo.update({
      ...toUpdate
    })

    response.status(200).send(todo)
  })

  app.delete('/todos/:id', async (request, response) => {
    const id = request.params.id

    const todo = await getTodoById(id)

    if (!todo) {
      return notFoundError(response, id)
    }

    todo.destroy()

    response.status(200).send(todo)
  })

  const server = app.listen(port, () => {
    if (!isTest) {
      console.log(`listening on port ${PORT}`)
    }
  })
  return server
}
