import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;

export const User = sequelize.define('user', {
  id: {
    type: DataTypes.STRING(128),
    allowNull: false,
    primaryKey: true,
  },
  pw: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  nick: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  classification: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  addr: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  loginedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export async function findByUserId(id) {
  return User.findOne({ where: { id } });
}

export async function createUser(user) {
  return User.create(user).then((data) => data.dataValues.id);
}
