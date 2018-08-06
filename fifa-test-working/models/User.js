
// Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
// sometimes causes errors on Windows machines
const bcrypt = require('bcrypt-nodejs')

// Creating our User model
module.exports = function(sequelize, DataTypes) {

  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        msg: 'That username\'s already been taken!'
      }
    },
    password: {
      type: DataTypes.STRING
    },
    budget: {
      type: DataTypes.INTEGER,
      defaultValue: 500000
    },
    Wins: {
      type: DataTypes.INTEGER,
    },
    Losses: {
      type: DataTypes.INTEGER,
    }
  }, {
    // Hooks are automatic methods that run during various phases of the User Model lifecycle
    // In this case, before a User is created, we will automatically hash their password
    hooks: {
      beforeCreate: function(user, options) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
      }
    },

    // explicitly tell sequelize what the name of the table will be
    tableName: 'users',

  })

  // Creating a custom instance method for our User model. This will check if an unhashed password entered by
  // The user can be compared to the hashed password stored in our database. This method will be available on
  // any instance of the user model.
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
  }

  User.associate = function (models) {
    User.hasOne(models.Team)

  }

  return User

}
