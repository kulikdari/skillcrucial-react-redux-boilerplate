import express from 'express'
import axios from 'axios'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'

import cookieParser from 'cookie-parser'
import Html from '../client/html'

let connections = []

const port = process.env.PORT || 3000
const server = express()

const { readFile, writeFile, unlink } = require('fs').promises

server.use(cors())

server.use(express.static(path.resolve(__dirname, '../dist/assets')))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
server.use(bodyParser.json({ limit: '50mb', extended: true }))

const setHeaders = ((req, res, next) => {
  res.set('x-skillcrucial-user', 'd8726345-f8b6-4817-bad3-c59175cecb51')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
})
server.use(setHeaders)

server.use(cookieParser())

const saveFile = async (users) => {
  const result = await writeFile(`${__dirname}/users.json`, JSON.stringify(users), { encoding: "utf8" })
  return result
}

const readData = async () => {
  const result = await readFile(`${__dirname}/users.json`, { encoding: "utf8" })
    .then(data => JSON.parse(data))
    .catch(async () => {
      const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      await saveFile(users)
      return users
    })
  return result
}

server.get('/api/v1/users', async (req, res) => {
  const users = await readData()
  res.json(users)
})

server.delete('/api/v1/users', async (req, res) => {
  unlink(`${__dirname}/users.json`)
  res.json({})
})

server.post('/api/v1/users', async (req, res) => {
  const users = await readData()
  const newUser = req.body
  newUser.id = users[users.length - 1].id + 1
  const newArr = [...users, newUser]
  await saveFile(newArr)
  res.json({ status: 'success', id: newUser.id })
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const reqBody = req.body
  reqBody.id = +userId
  const users = await readData()
  const checkId = users.map(function (it) {
    if (it.id === reqBody.id) {
      return { ...it, ...reqBody }
    }
    return it
  })
  await saveFile(checkId)
  res.json({ status: 'success', id: +userId, body: reqBody })
})


server.delete('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const users = await readData()
  const checkE = users.filter(it => it.id !== +userId)
  await saveFile(checkE)
  res.json({ status: 'success', id: +userId })
})


server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const echo = sockjs.createServer()
echo.on('connection', (conn) => {
  connections.push(conn)
  conn.on('data', async () => { })

  conn.on('close', () => {
    connections = connections.filter((c) => c.readyState !== 3)
  })
})

server.get('/', (req, res) => {
  // const body = renderToString(<Root />);
  const title = 'Server side Rendering'
  res.send(
    Html({
      body: '',
      title
    })
  )
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

echo.installHandlers(app, { prefix: '/ws' })

// eslint-disable-next-line no-console
console.log(`Serving at http://localhost:${port}`)
