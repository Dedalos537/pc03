import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('admin', 'cliente'),
      defaultValue: 'cliente',
    },
  },
  {
    timestamps: false, // Desactiva createdAt y updatedAt
    tableName: 'Usuarios', // Asegúrate de que el nombre coincide con la tabla en la base de datos
  }
);
export default Usuario;
