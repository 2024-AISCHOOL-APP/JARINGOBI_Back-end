import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as communityController from '../controller/community.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validateContent = [
  body('title').trim().isLength({ min: 1 }).withMessage('title sholud be at least 1 characters'),
  body('text').trim().isLength({ min: 1 }).withMessage('text should be at least 1 characters').notEmpty(),
  validate,
];

// router.get('/', communityController.getAll);
router.post('/', isAuth, validateContent, communityController.createPost);

export default router;
