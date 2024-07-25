import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as accountController from '../controller/account.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validateAccount = [
  body('amount')
    .trim()
    .isLength({ min: 1 })
    .withMessage('금액은 1글자 이상이어야 함')
    .isNumeric()
    .withMessage('숫자만 입력할 수 있음')
    .notEmpty(),
  validate,
];

router.post('/', isAuth, validateAccount, accountController.createAccount);

export default router;
