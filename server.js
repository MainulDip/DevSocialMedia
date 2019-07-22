const express = require('express')
const connectDB = require('./config/db')
const path = require('path')

const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({ extended: false }))

// app.get('/', (req, res) => res.send('API Running'))
// app.get('/', (req, res) => res.send(process.env.Path))

// Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

// Serve Static Assets In Production Mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

// check if server port variable is set default at heroku servers
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server Started On Port ${PORT}`))
