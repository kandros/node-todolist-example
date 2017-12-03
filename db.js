const Sequelize = require('sequelize')

exports.init = async function init (dbConfig, isTest) {
  const sequelize = new Sequelize({
    host: 'localhost',
    dialect: 'postgres',
    database: dbConfig.dbName,
    username: dbConfig.username,
    password: dbConfig.password,
    operatorsAliases: false,
    logging: isTest ? false : undefined
  })

  const Todo = sequelize.define(
    'todo',
    {
      text: {
        type: Sequelize.STRING,
        allowNull: false
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    },
    {
      timestamps: false
    }
  )

  const models = {
    Todo
  }

  await sequelize.sync({
    force: isTest
  })

  const db = {
    models,
    sequelize
  }

  return db
}
