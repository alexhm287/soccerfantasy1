
'use strict'

// Requiring our models
const db = require('../models')
const { Op } = require('sequelize')

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require('../middleware/isAuthenticated')


module.exports = app => {

  //
  //
  // users
  //
  //

  // This route handler makes use of the new async/await syntax
  // for resolving asynchronous code.
  app.get('/users', async function(req, res) {

    try {
      const findOptions = {
        where: {
          id: {
            // This little bit of syntax `[Op.ne]` is another new feature:
            // "Computed property names in object literals"
            // Which just means that it will evaluate the expression inside
            // the square brackets and whatever it evaluates to will be the
            // name of the property. There were already computed property names
            // before this, but they could only be used on the variables an object
            // had been assigned to. For instance, the old way would look like:
            /*
              var name = 'David'
              var obj = {}
              obj[ name ] = 'Some goober'
            */
            // At the end of those three lines of code `obj` would be: `{ David: 'Some goober' }`
            // This new feature allows for you to combine the last two lines to that it looks like:
            /*
              var name = 'David'
              var obj = { [ name ]: 'Some goober' }
            */

            [Op.ne]: req.user.id
          }
        }
      }
      const users = await db.User.findAll(findOptions)

      res.json({ users })
    }
    catch (err) {
      console.log('Error getting user: ', err)
      res.status(500).send('Error getting users.')
    }

  })

  // The equivalent handler written using promises would look like the following:
  /*
  app.get('/users', function(req, res) {

    const findOptions = {
      where: {
        id: {
          [Op.ne]: req.user.id
        }
      }
    }

    db.User.findAll(findOptions)
      .then(function(users) {

        res.json({ users })

      })
      .catch(function(err) {
        console.log('Error getting user: ', err)
        res.status(500).send('Error getting users.')
      })

  })
  */

  app.get('/players', async function(req, res) {
    try {
      const findOptions = {
        where: {
          TeamId: null
        }
      }
      const players = await db.Player.findAll(findOptions);
      if (players.length <= 0) {
        await db.Player.create({ name: "Ronaldo", strength: 10 })
        await db.Player.create({ name: "Messi", strength: 5 })
        await db.Player.create({ name: "Neymar", strength: 8 })
        await db.Player.create({ name: "Luis", strength: 6 })
        await db.Player.create({ name: "Modric", strength: 4 })
        await db.Player.create({ name: "Mueller", strength: 9 })
        await db.Player.create({ name: "Maradona", strength: 10 })
        await db.Player.create({ name: "Avis", strength: 4 })
        await db.Player.create({ name: "Macky", strength: 5 })
        await db.Player.create({ name: "Jaul", strength: 7 })
        await db.Player.create({ name: "Raul", strength: 8 })
        await db.Player.create({ name: "Micky", strength: 2 })
        await db.Player.create({ name: "Ricky", strength: 1 })
        await db.Player.create({ name: "Randy", strength: 1 })
      }
      res.json(players)
    }
    catch (err) {
      console.log('Error getting players: ', err)
      res.status(500).send('Error getting players')
    }
  })

  app.post('/players', async function(req, res) {
    const { name } = req.body
    const strength = Math.floor(Math.random() * 10);  
    try {
      const player = await db.Player.create({ name, strength })
      res.json(player)
    }
    catch (err) {
      console.log('Error creating player: ', err)
      res.status(500).send('Error creating player')
    }
  })

  app.post('/playmatch', async function(req, res) {
      const { uid, oid } = req.body
      const me = await db.User.findOne({ where: { id: uid }})
      const them = await db.User.findOne({ where: { id: oid }})
      const myTeam = await me.getTeam()
      const opTeam = await them.getTeam()
      const myPlayers = await myTeam.getPlayers();
      const opPlayers = await opTeam.getPlayers();
      var myStrength = 0;
      var opStrength = 0;
      for (var i = 0; i < 5; i++)  {
          myStrength += myPlayers[i].strength;
          opStrength += opPlayers[i].strength;
      } 
      if (myStrength > opStrength) {
        res.json({won: true})
      }
      else {
        res.json({won: false})
      }

  })

  app.get('/myplayers/:uid', async function(req, res) {
    try {
      const user = await db.User.findOne({ where: { id: req.params.uid }})
      const team = await user.getTeam()
      const players = await team.getPlayers();
      res.json(players)
    }
    catch (err) {
      console.log('Error getting players: ', err)
      res.status(500).send('Error getting players')
    }
  })

  app.get('/myteam/:uid', async function(req, res) {
    try {
      const user = await db.User.findOne({ where: { id: req.params.uid }})
      const team = await user.getTeam();
      res.json(team);
    }
    catch (err) {
      console.log('Error getting team: ', err)
      res.status(500).send('Error getting team')
    }
  })

  app.post('/addplayertoteam', async function(req, res) {
    const { uid, pid } = req.body
    try {
      const user = await db.User.findOne({ where: { id: uid }})
      const team = await user.getTeam()
      const players = await team.getPlayers();
      var success = false;
      var budget = user.budget;

      if (players.length < 5) {
        const player = await db.Player.findOne({ where: { id: pid }})
        var str = player.strength;
        var playerVal = str * 10000;
        
        var newBudget = budget - playerVal;
        if (newBudget >= 0) {
          await player.update({ TeamId: team.id })
          budget = newBudget;          
          await user.update({budget: budget})
          success = true;
        }
      }
      res.json({ success: success, budget: budget })
    }
    catch (err) {
      console.log('Error adding player to team: ', err)
      res.status(500).send('Error adding player to team')
    }
  })

  app.post('/removeplayerfromteam', async function(req, res) {
    const { uid, pid } = req.body
    try {
      const user = await db.User.findOne({ where: { id: uid }})
      const team = await user.getTeam()
      const player = await db.Player.findOne({ where: { id: pid }})
      await player.update({TeamId: null})
      res.json({success: true})
    }
    catch (err) {
      console.log('Error removing player from team: ', err)
      res.status(500).send('Error removing player from team')
    }
  })

  app.post('/myteam', async function(req, res) {
    const { title, uid } = req.body
    try {
      const user = await db.User.findOne({ where: { id: uid }})
      const team = await db.Team.create({title: title})
      user.setTeam(team)
      res.json(team)
    }
    catch (err) {
      console.log('Error creating team for user: ', err)
      res.status(500).send('Error creating team for user')
    }
  })

  app.get('/conversations', async function(req, res) {

    try {
      const findOptions = {
        include: [
          {
            model: db.Message,
            order: [['createdAt', 'DESC']],
            include: [{ model: db.User }]
          },
          db.User
        ],
        order: [['createdAt', 'DESC']]
      }
      const user = await db.User.findOne({ where: { id: req.user.id }})
      const conversations = await user.getConversations(findOptions)

      res.json(conversations)
    }
    catch (err) {
      console.log('Error getting conversations: ', err)
      res.status(500).send('Error getting conversations')
    }

  })

  app.post('/conversations', async function(req, res) {

    const { users, title } = req.body
    users.push(req.user)

    try {
      const conversation = await db.Conversation.create({ title })
      const findOptions = {
        where: {
          id: {
            [Op.in]: users.map( u => u.id )
          }
        }
      }
      const userInstances = await db.User.findAll(findOptions)
      await conversation.setUsers(userInstances)

      res.json(conversation)
    }
    catch (err) {
      console.log('Error creating conversation: ', err)
      res.status(500).send('Error creating conversation')
    }
  })



  //
  //
  // messages
  //
  //

  app.post('/messages', async function(req, res) {

    try {
      const message = await db.Message.create(req.body)

      res.json(message)
    }
    catch (err) {
      console.log('Error creating message: ', err)
      res.status(500).send('Error creating message')
    }

  })

}
