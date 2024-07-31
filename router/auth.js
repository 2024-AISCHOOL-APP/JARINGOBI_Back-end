import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as authController from '../controller/auth.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validateCredential = [
  body('id')
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage('아이디는 최소 5글자 이상이어야 함')
    .isAlphanumeric()
    .withMessage('아이디는 알파벳과 숫자만 포함해야 함.'),
  body('pw')
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage('비밀번호는 최소 5자 이상이어야 함.')
    .matches(/[a-z]/)
    .withMessage('비밀번호는 하나 이상의 소문자를 포함해야 함.')
    .matches(/[0-9]/)
    .withMessage('비밀번호는 하나 이상의 숫자를 포함해야 함.'),
  validate,
];

router.post('/signup', validateCredential, authController.signup);

router.post('/login', validateCredential, authController.login);

router.get('/me', isAuth, authController.me);

export default router;
