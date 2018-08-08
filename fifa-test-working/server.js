
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

app.get('/', function(req, res, next){
  res.sendStatus(200);
});

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
// async function initDb() {
//     const db = require('./models/index.js')
//     await db.sequelize.sync({ force: true })
//     await db.Player.create({ name: "Ronaldo", strength: 10, imgUrl: "https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjz8-nzg9rcAhWRLXwKHbcTD3IQjRx6BAgBEAU&url=https%3A%2F%2Fwww.usatoday.com%2Fstory%2Fsports%2Fsoccer%2Feurope%2F2018%2F08%2F05%2Ffans-react-cristiano-ronaldo-juventus-real-madrid%2F910343002%2F&psig=AOvVaw3EKnSwzg48qg1X8WXtjZJo&ust=1533700008374217" })
//     await db.Player.create({ name: "Messi", strength: 5 })
//     await db.Player.create({ name: "Neymar", strength: 8 })
//     await db.Player.create({ name: "Luis", strength: 6 })
//     await db.Player.create({ name: "Modric", strength: 4 })
//     await db.Player.create({ name: "Mueller", strength: 9 })
//     await db.Player.create({ name: "Maradona", strength: 10 })
//     await db.Player.create({ name: "Avis", strength: 4 })
//     await db.Player.create({ name: "Macky", strength: 5 })
//     await db.Player.create({ name: "Jaul", strength: 7 })
//     await db.Player.create({ name: "Raul", strength: 8 })
//     await db.Player.create({ name: "Micky", strength: 2 })
//     await db.Player.create({ name: "Ricky", strength: 1 })
//     await db.Player.create({ name: "Randy", strength: 1 })
// }

// // Comment out when you don't want to synch the db
// initDb();

//=================================================
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`

  ==> 🌎  Listening on port ${ PORT }. Visit http://localhost:${ PORT }/ in your browser.

  `)
})

// export the app for testing
module.exports = app
