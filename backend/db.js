const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('crud_productos', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
