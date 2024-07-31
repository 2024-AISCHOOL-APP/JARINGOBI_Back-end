import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
import { Op } from 'sequelize';
import moment from 'moment';
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
  title: {
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

export async function getAllDateYear(userId, year) {
  const startDate = moment(`${year}`, 'YYYY')
  .startOf('year')
  .startOf('month')
  .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  .toDate();
  const endDate = moment(`${year}`, 'YYYY')
  .endOf('year')
  .endOf('month')
  .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
  .toDate();
  return Account.findAll({
    where: {
      userId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  }).then((data) => {
    return data;
  });
}

export async function getAllDateMonth(userId, year, month) {
  const startDate = moment(`${year}-${month}`, 'YYYY-MM')
  .startOf('month')
  .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  .toDate();
  const endDate = moment(`${year}-${month}`, 'YYYY-MM')
  .endOf('month')
  .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
  .toDate();
  return Account.findAll({
    where: {
      userId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  }).then((data) => {
    return data;
  });
}



export async function getAllDateDay(userId, year, month, day) {
  const targetDate = moment(`${year}-${month}-${day}`);
  const startDate = targetDate.startOf('day').toDate();
  const endDate = targetDate.endOf('day').toDate();
  return Account.findAll({
    where: {
      userId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  }).then((data) => {
    return data;
  });
}

export async function getById(id) {
  return Account.findOne({
    where: { id },
  });
}

export async function update(id, first, second, amount, description) {
  return Account.findByPk(id).then((acc) => {
    acc.first_category = first;
    acc.second_category = second;
    acc.amount = amount;
    acc.description = description;
    return acc.save();
  });
}

export async function remove(id) {
  return Account.findByPk(id).then((acc) => acc.destroy());
}
