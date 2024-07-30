import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

export const Post = sequelize.define('post', {
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

const INCLUDE_USER = {
  attributes: [
    'id',
    'title',
    'tag',
    'text',
    'createdAt',
    'userId',
    [Sequelize.col('user.name'), 'name'],
    [Sequelize.col('user.nick'), 'nickname'],
  ],
  include: {
    model: User,
    attributes: [],
  },
};

const ORDER_DESC = {
  order: [['createdAt', 'DESC']],
};

export async function getAll() {
  return Post.findAll({ ...INCLUDE_USER, ...ORDER_DESC, raw: true });
}

export async function getAllByUserId(id) {
  return Post.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { id },
    },
    raw: true,
  });
}

export async function getById(id) {
  return Post.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
}

export async function create(text, title, tag, userId) {
  return Post.create({ text, title, tag, userId }).then((data) => {
    return data;
  });
}

export async function update(id, text, title, tag) {
  return Post.findByPk(id, INCLUDE_USER).then((post) => {
    post.text = text;
    post.title = title;
    post.tag = tag;
    return post.save();
  });
}

export async function remove(id) {
  return Post.findByPk(id).then((post) => post.destroy());
}
