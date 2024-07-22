import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;

export const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.STRING(128),
    allowNull: false,
    primaryKey: true,
  },
  user_pw: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  user_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  user_nick: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  user_email: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  user_classification: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  user_addr: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  user_gender: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  user_loginedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export async function findByUserId(user_id) {
  return User.findOne({ where: { user_id } });
}

export async function createUser(user) {
  return User.create(user).then((data) => data.dataValues.user_id);
}
