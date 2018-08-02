module.exports = function(sequelize, DataTypes) {

  const Player = sequelize.define('Player', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      unique: {
        msg: 'That player\'s already been taken!'
      }
    },
    strength: {
      type: DataTypes.INTEGER
    },
    priceTag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
  }, {
    tableName: 'players'
  })

  Player.associate = function (models) {
    Player.belongsTo(models.Team)
  }

  return Player

}
