import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
import { Post } from './community.js';

const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

const Comment = sequelize.define('comment', {
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

const INCLUDE_USER_POST = {
  attributes: ['id', 'text', 'userId', 'postId', [Sequelize.col('user.name'), 'name'], [Sequelize.col('user.nick'), 'nickname']],
  include: {
    model: User,
    attributes: [],
  },
};

const ORDER_DESC = {
  order: [['createdAt', 'DESC']],
};

export async function getAll(postId) {
  return Comment.findAll({
    where: { postId },
  });
}

export async function create(text, userId, postId) {
  return Comment.create({ text, userId, postId }).then((data) => {
    console.log(data);
    return data;
  });
}
