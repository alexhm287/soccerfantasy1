// mysql://b6c03a3942e4de:ce4f1ffd@us-cdbr-iron-east-04.cleardb.net/heroku_d5f4a6c6bcdfd45?reconnect=true

module.exports = {
 development: {
    username: "root",
    password: null,
    database: "ucbproject3",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: null
  },
   development1: {
     username: "b6c03a3942e4de",
     password: "ce4f1ffd",
     database: "heroku_d5f4a6c6bcdfd45",
     host: "us-cdbr-iron-east-04.cleardb.net",
     dialect: "mysql",
     logging: null
   },
  test: {
    username: "root",
    password: null,
    database: "ucbproject3_test",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: null // don't show the SQL queries when running tests
  },
  // production: {
  //   username: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME,
  //   host: process.env.DB_HOST,
  //   dialect: "mysql"
  // },

  production: {
    username: "ripevbk00fga0zbb",
    password: "xsykmiizhaypk8wm",
    database: "l91nxicwb5ohms57",
    host: "a5s42n4idx9husyc.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    dialect: "mysql"
  },
}
