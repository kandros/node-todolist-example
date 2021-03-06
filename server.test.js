const server = require('./server')
const axios = require('axios')
const database = require('./db')

const http = axios.create({
  baseURL: 'http://localhost:5000'
})

function createTodo (text) {
  return http.post(`/todos`, {
    text
  })
}

describe('server', () => {
  let s
  beforeEach(async () => {
    const isTest = process.env.NODE_ENV === 'test'
    const db = await database.init(
      {
        dbName: 'node-todolist',
        username: 'postgres',
        password: 'postgres'
      },
      isTest
    )
    s = await server.start(5000, { db })
  })
  afterEach(() => {
    s.close()
  })

  it('starts without crashing', () => {
    expect(() => {}).not.toThrow()
  })

  describe('GET /todos', () => {
    it('should return all todods', async () => {
      const res = await http.get('/todos')
      expect(res.data).toEqual([])
    })
  })

  describe('GET /todos:id', () => {
    it('should return todo with right id', async () => {
      const createRes = await createTodo('ciaone')
      const id = createRes.data.id
      const getRes = await http.get(`/todos/${id}`)

      expect(getRes.data.id).toEqual(id)
    })

    it('should return 404 if todo with specified id is not found', done => {
      // usa res.status

      const id = 12345
      http.get(`/todos/${id}`).catch(err => {
        expect(err.response.status).toEqual(404)
        done()
      })
    })
  })

  describe('POST /todos', () => {
    it('should create a todo', async () => {
      const createRes = await createTodo('ciaone')
      const id = createRes.data.id
      const getRes = await http.get('/todos')
      const todo = getRes.data.find(t => t.id === id)
      expect(todo.text).toEqual('ciaone')
    })

    it('should return created todo', async () => {
      const res = await createTodo('ciaone')
      expect(res.data.text).toEqual('ciaone')
    })
  })

  describe('PATCH /todos:id', () => {
    it('should return updated todo', async () => {
      const createRes = await createTodo('ciaone')
      const id = createRes.data.id
      const newText = 'enoaic'
      const patchRes = await http.patch(`/todos/${id}`, { text: newText })
      expect(patchRes.data.text).toEqual(newText)
    })

    it('should update text of todo specified by id', async () => {
      const createRes = await createTodo('ciaone')
      const id = createRes.data.id
      const newText = 'enoaic'
      await await http.patch(`/todos/${id}`, { text: newText })
      const getRes = await http.get(`/todos/${id}`)
      expect(getRes.data.text).toEqual(newText)
    })
  })

  describe('DELETE /todos:id', () => {
    it('should delete todo identified by id', async done => {
      const createRes = await createTodo('ciaone')
      const id = createRes.data.id
      await http.delete(`/todos/${id}`)

      http.get(`/todos/${id}`).catch(err => {
        expect(err.response.status).toEqual(404)

        done()
      })
    })
    it('should returnd deleted todo', async () => {
      const createRes = await createTodo('ciaone')
      const id = createRes.data.id
      const deletedRes = await http.delete(`/todos/${id}`)
      expect(deletedRes.data.id).toEqual(id)
    })
  })
})
