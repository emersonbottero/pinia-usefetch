const express = require('express')
const jsonwebtoken = require('jsonwebtoken')
const cors = require('cors')

// The secret should be an unguessable long string (you can use a password generator for this!)
const JWT_SECRET = 'goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu'

const app = express()
app.use(express.json())
app.use(cors())

app.post('/login', (req, res) => {
  const { username, password } = req.body
  console.log(`${username} is trying to login ..`)

  if (username === 'admin' && password === 'admin') {
    return res.json({
      token: jsonwebtoken.sign({ user: 'admin' }, JWT_SECRET)
    })
  }

  return res.status(401).json({ message: 'The username and password your provided are invalid' })
})

app.get('/super-secure-resource', (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Not Authorized' })
  }

  // Bearer <token>>
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]

  try {
    // Verify the token is valid
    const { user } = jsonwebtoken.verify(token, JWT_SECRET)
    return res.status(200).json({
      message: `Congrats ${user}! You can now access the super secret resource`
    })
  } catch (error) {
    console.error(error)
    return res.status(401).json({ error: 'Not Authorized' })
  }
})

app.get('/not-protected', (req, res) => {
  return res.status(200).json({
    message: `Anyone can touch that`
  })
})

app.listen(3001, () => {
  console.log('API running on localhost:3001')
})
