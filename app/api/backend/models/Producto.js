import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

class Producto extends Model {}

Producto.init({
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imagen_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  eliminado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fecha_eliminacion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Producto',
});

export default Producto;
