
'use strict'

// Requiring necessary npm packages
const express = require('express')
const morgan = require('morgan')
const http = require('http')
const io = require('socket.io')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const path = require('path')

// Creating express app and configuring middleware needed for authentication
const app = express()
const server = http.createServer(app)
const socketIo = io(server)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// request logging middleware
app.use(morgan('dev'))

// Serve up optimized static assets for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

// We need to use sessions to keep track of our user's login status
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

// Passing the passport singleton to our passport middleware to load our authentication strategies
require('./middleware/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())


// Requiring our authentication routes
require('./routes/auth.js')(app, passport)

// Requiring our api routes
require('./routes/api.js')(app)

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

// Setup socket.io
socketIo.on('connection', socket => {

  const { username } = socket.handshake.query
  console.log(`${ username } connected`)

  socket.on('client:message', data => {
    console.log(`${ data.username }: ${ data.body }`)

    // message received from client, now broadcast it to everyone else
    socket.broadcast.emit('server:message', data)
  })

  socket.on('disconnect', () => {
    console.log(`${ username } disconnected`)
  })

})

// AFTER YOU RUN 'YARN START' THE FIRST TIME COMMENT
// OUT LINES  76 & 78
//=================================================

const db = require('./models/index.js')

db.sequelize.sync({ force: true })

//=================================================
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`

  ==> 🌎  Listening on port ${ PORT }. Visit http://localhost:${ PORT }/ in your browser.

  `)
})

// export the app for testing
module.exports = app
