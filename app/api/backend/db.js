import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL || 'mysql://root@localhost:3306/crud_productos', {
  dialect: 'mysql',
  logging: false,
});

export default sequelize;
