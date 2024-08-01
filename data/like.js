import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
import { Post } from './community.js';
import { Comment } from './comment.js';
const DataTypes = SQ.DataTypes;

const Like = sequelize.define('like', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Post, { foreignKey: 'postId' });
Like.belongsTo(Comment, { foreignKey: 'commentId' });

export async function existingLike(postId, userId, commentId) {
  if (commentId) {
    return Like.findOne({
      where: {
        postId,
        userId,
        commentId,
      },
    });
  } else {
    return Like.findOne({
      where: {
        postId,
        userId,
      },
    });
  }
}

export async function addLike(postId, userId, commentId) {
  if (commentId) {
    return Like.create({
      postId,
      userId,
      commentId,
    }).then((data) => {
      return data;
    });
  } else {
    return Like.create({
      postId,
      userId,
    }).then((data) => {
      return data;
    });
  }
}

export async function likeCount(postId, commentId) {
  if (commentId) {
    return Like.count({
      where: {
        postId,
        commentId,
      },
    });
  } else {
    return Like.count({
      where: {
        postId,
      },
    });
  }
}

export async function remove(postId, userId, commentId) {
  if (commentId) {
    return Like.findOne({
      where: {
        postId,
        userId,
        commentId,
      },
    }).then((like) => like.destroy());
  } else {
    return Like.findOne({
      where: {
        postId,
        userId,
      },
    }).then((like) => like.destroy());
  }
}
