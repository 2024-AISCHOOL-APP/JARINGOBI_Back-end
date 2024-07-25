import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as communityController from '../controller/community.js';
import * as commentController from '../controller/comment.js';
import * as likeController from '../controller/like.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validateContent = [
  body('title').trim().isLength({ min: 1 }).withMessage('제목은 한글자 이상이어야 함').notEmpty(),
  body('text').trim().isLength({ min: 1 }).withMessage('내용은 한글자 이상이어야 함').notEmpty(),
  validate,
];

const validateComment = [body('text').trim().isLength({ min: 1 }).withMessage('댓글은 1글자 이상이어야 함'), validate];

router.get('/', isAuth, communityController.getPosts);
router.get('/:id', isAuth, communityController.getPost);
router.post('/', isAuth, validateContent, communityController.createPost);
router.put('/:id', isAuth, validateContent, communityController.updatePost);
router.delete('/:id', isAuth, communityController.deletePost);

// 댓글
router.get('/:id/comments', isAuth, commentController.getComments);
router.post('/:id/comments', isAuth, validateComment, commentController.createComments);
router.put('/:id/comments/:commentId', isAuth, validateComment, commentController.updateComment);
router.delete('/:id/comments/:commentId', isAuth, commentController.deleteComment);

// 게시물 좋아요
router.post('/:id/like', isAuth, likeController.like);
router.get('/:id/like', likeController.likeCount);
router.delete('/:id/like', isAuth, likeController.deleteLike);

// 댓글 좋아요
router.post('/:id/comments/:commentId/like', isAuth, likeController.like);
router.get('/:id/comments/:commentId/like', likeController.likeCount);
router.delete('/:id/comments/:commentId/like', isAuth, likeController.deleteLike);

export default router;
