const server = require('./server')
const database = require('./db')

const PORT = 5000

database
  .init({
    dbName: 'node-todolist',
    username: 'postgres',
    password: 'postgres'
  })
  .then(db => {
    server.start(PORT, { db })
  })
