import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
const DataTypes = SQ.DataTypes;

const Account = sequelize.define('account', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  first_category: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  second_category: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Account.belongsTo(User);

export async function create(userId, first_category, second_category, amount, description) {
  return Account.create({ userId, first_category, second_category, amount, description }).then((data) => {
    return data;
  });
}
