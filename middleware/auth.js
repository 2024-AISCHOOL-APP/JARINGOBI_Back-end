import jwt from 'jsonwebtoken';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

const AUTH_ERROR = { message: 'Authentication faild' };

export const isAuth = async (req, res, next) => {
  let token;
  const authHeader = req.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    token = req.cookies['token'];
  }
  if (!token) {
    return res.status(401).json(AUTH_ERROR);
  }
  try {
    let payload = jwt.verify(token, config.jwt.secretKey);
    const user = await userRepository.findByUserId(payload.id);
    req.userId = user.dataValues.id;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json(AUTH_ERROR);
  }
};
