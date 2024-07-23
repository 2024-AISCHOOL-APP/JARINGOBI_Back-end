import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

const Post = sequelize.define('post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tag: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  editDate: {
    type: DataTypes.DATE,
  },
});
Post.belongsTo(User);

export async function getAll() {
  return Post.findAll().then((data) => {
    console.log(data);
    return data;
  });
}

export async function create(text, title, tag, userId) {
  return Post.create({ text, title, tag, userId }).then((data) => {
    return data;
  });
}
