const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      user : 'root',
      password : 'toor#@!',
      database : 'apiusers'
    }
  })

module.exports = knex