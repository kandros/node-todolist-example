const express = require('express')
const uuid = require('uuid')

const PORT = 5000

let todos = []

exports.start = function (port) {
  const app = express()
  const notFoundError = (response, id) => {
    response.status(404).send({
      message: `todo with ${id} not found`
    })
  }
  const getTodoById = id => todos.find(todo => todo.id === id)

  app.get('/todos', (request, response) => response.send(todos))

  app.get('/todos/:id', (request, response) => {
    const id = request.params.id
    const todo = getTodoById(id)

    if (!todo) {
      return notFoundError(response, id)
    }

    response.status(200).send(todo)
  })

  app.patch('/todos/:id', (request, response) => {
    const id = request.params.id
    const newChecked = request.query.checked
    const newText = request.query.text

    const todo = getTodoById(id)

    if (!todo) {
      return notFoundError(response, id)
    }

    todo.checked = newChecked || todo.checked
    todo.text = newText || todo.Text

    response.status(200).send(todo)
  })

  app.delete('/todos/:id', (request, response) => {
    const id = request.params.id

    const todo = getTodoById(id)

    if (!todo) {
      return notFoundError(response, id)
    }

    todos = todos.filter(todo => todo.id !== id)

    response.status(200).send(todo)
  })

  app.post('/todos', (request, response) => {
    const text = request.query.text

    if (!text) {
      response.status(400).send({
        message: 'text is required'
      })
      return
    }

    const newTodo = {
      id: uuid.v1(),
      text,
      completed: false
    }

    todos.push(newTodo)

    response.status(201)
    response.send(newTodo)
  })

  const server = app.listen(port, () =>
    console.log(`listening on port ${PORT}`)
  )
  return server
}
