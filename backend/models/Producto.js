const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Importar sequelize desde el archivo db.js

const Producto = sequelize.define('Producto', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  imagen_url: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = Producto;
