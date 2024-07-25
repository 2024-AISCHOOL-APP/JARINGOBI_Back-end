import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
import { Post } from './community.js';

const DataTypes = SQ.DataTypes;

export const Comment = sequelize.define('comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Comment.belongsTo(User);
Comment.belongsTo(Post);

export async function getAll(postId) {
  return Comment.findAll({
    where: { postId },
  });
}

export async function create(text, userId, postId) {
  return Comment.create({ text, userId, postId }).then((data) => {
    return data;
  });
}

export async function getById(postId, id) {
  return Comment.findOne({
    where: {
      postId,
      id,
    },
  });
}

export async function update(postId, id, text) {
  return Comment.findByPk(id, {
    where: { postId, id },
  }).then((comment) => {
    comment.text = text;
    return comment.save();
  });
}

export async function remove(postId, id) {
  return Comment.findByPk(id, {
    where: { postId, id },
  }).then((comment) => comment.destroy());
}
