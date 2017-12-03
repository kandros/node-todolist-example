const server = require('./server')
const axios = require('axios')

function createTodo (text) {
  return axios.post(`http://localhost:5000/todos?text=${text}`)
}

describe('server', () => {
  it('starts without crashing', () => {
    expect(() => {
      const s = server.start(5000)
      s.close()
    }).not.toThrow()
  })

  it('throw test', () => {})

  describe('GET /todos', () => {
    it('should return all todods', async () => {
      const s = server.start(5000)
      const res = await axios.get('http://localhost:5000/todos')
      expect(res.data).toEqual([])
      s.close()
    })
  })

  describe('POST /todos', () => {
    it('should create a todo', async () => {
      const s = server.start(5000)
      await createTodo('ciaone')
      const res = await axios.get('http://localhost:5000/todos')
      expect(res.data[0].text).toEqual('ciaone')
      s.close()
    })

    it('should return created todo', async () => {
      const s = server.start(5000)
      const res = await createTodo('ciaone')
      expect(res.data.text).toEqual('ciaone')
      s.close()
    })
  })

  describe('GET /todos:id', () => {
    it('should return todo with right id', async () => {
      const s = server.start(5000)
      const createRes = await createTodo('ciaone')
      const id = createRes.data.id
      const getRes = await axios.get(`http://localhost:5000/todos/${id}`)

      expect(getRes.data.id).toEqual(id)
      s.close()
    })

    it('should return 404 if todo with specified id is not found', done => {
      // usa res.status
      const s = server.start(5000)
      const id = 12345
      axios.get(`http://localhost:5000/todos/${id}`).catch(err => {
        expect(err.response.status).toEqual(404)
        s.close()
        done()
      })
    })
  })

  describe('PATCH /todos:id', () => {
    it('should return updated todo', async () => {
      const s = server.start(5000)
      const createRes = await createTodo('ciaone')
      const id = createRes.data.id
      const newText = 'enoaic'
      const patchRes = await axios.patch(
        `http://localhost:5000/todos/${id}?text=${newText}`
      )
      expect(patchRes.data.text).toEqual(newText)
      s.close()
    })

    it('should update text of todo specified by id', async () => {
      const s = server.start(5000)
      const createRes = await createTodo('ciaone')
      const id = createRes.data.id
      const newText = 'enoaic'
      await axios.patch(`http://localhost:5000/todos/${id}?text=${newText}`)
      const getRes = await axios.get(`http://localhost:5000/todos/${id}`)
      expect(getRes.data.text).toEqual(newText)
      s.close()
    })
  })

  describe('DELETE /todos:id', () => {
    it('should delete todo identified by id', async done => {
      const s = server.start(5000)
      const createRes = await createTodo('ciaone')
      const id = createRes.data.id
      await axios.delete(`http://localhost:5000/todos/${id}`)

      axios.get(`http://localhost:5000/todos/${id}`).catch(err => {
        expect(err.response.status).toEqual(404)
        s.close()
        done()
      })
    })
    it('should returnd deleted todo', async () => {
      const s = server.start(5000)
      const createRes = await createTodo('ciaone')
      const id = createRes.data.id
      const deletedRes = await axios.delete(`http://localhost:5000/todos/${id}`)
      expect(deletedRes.data.id).toEqual(id)
      s.close()
    })
  })

  // using promises
  // describe('GET /todos', () => {
  //   it('should return all todods', done => {
  //     const s = server.start(5000)
  //     axios.get('http://localhost:5000/todos').then(res => {
  //       expect(res.data).toEqual([])
  //       s.close()
  //       done()
  //     })
  //   })
  // })
})
