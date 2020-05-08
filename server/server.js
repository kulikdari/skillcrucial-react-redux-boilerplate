import express from 'express'
import axios from 'axios'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'

import cookieParser from 'cookie-parser'
import Html from '../client/html'

let connections = []

const filename = 'users.json'

const port = process.env.PORT || 3000
const server = express()

const { readFile, writeFile, unlink, stat } = require('fs').promises

server.use(cors())

server.use(express.static(path.resolve(__dirname, '../dist/assets')))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
server.use(bodyParser.json({ limit: '50mb', extended: true }))

server.use(cookieParser())

const saveFile = async (data) => {
  // eslint-disable-next-line no-return-await
  return await writeFile(`${__dirname}/${filename}`, JSON.stringify(data), { encoding: 'utf8' })
}

const readData = async (fileName) => {
  // eslint-disable-next-line no-return-await
  return await readFile(`${__dirname}/${fileName}`, { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch(async () => {
      const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      await saveFile(users)
      return users
    })
}

server.get('/api/v1/users', async (req, res) => {
  const users = await readData(filename)
  res.json(users)
})

server.post('/api/v1/users', async (req, res) => {
  let newUser = req.body
  let users = await readData(filename)
  let maxValue = 0
  for (let i = 0; i < users.length; i += 1) {
    if (maxValue < users[i].id) {
      maxValue = users[i].id
    }
  }
  maxValue += 1
  newUser = await { ...newUser, id: maxValue }
  users = [...users, newUser]
  await saveFile(users)
  res.json({ status: 'success', id: maxValue })
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  let newUser = req.body
  let users = await readData(filename)
  const { userId } = req.params
  newUser = { ...newUser, id: +userId }
  users = users.filter((it) => it.id !== +userId)
  users = [...users, newUser]
  await saveFile(users)
  res.json({ status: 'success', id: +userId })
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  let users = await readData(filename)
  const { userId } = req.params
  users = users.filter((it) => it.id !== +userId)
  await saveFile(users)
  res.json({ status: 'success', id: +userId })
})

server.delete('/api/v1/users/', async (req, res) => {
  stat(`${__dirname}/${filename}`)
    .then(() => {
      res.json({ status: 'Success' })
      unlink(`${__dirname}/${filename}`)
    })
    .catch((err) => res.json({ status: 'Error', ErrorMessage: err }))
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
