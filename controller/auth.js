import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config.js';
import * as userRepository from '../data/auth.js';

export async function signup(req, res) {
  const { user_id, user_pw, user_name, user_nick, user_email, user_addr, user_gender } = req.body;
  const found = await userRepository.findByUserId(user_id);
  if (found) {
    return res.status(409).json({ message: `${user_id} already exists` });
  }
  const hashed = await bcrypt.hash(user_pw, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    user_id,
    user_pw: hashed,
    user_name,
    user_nick,
    user_email,
    user_addr,
    user_gender,
    user_classification: '사용자',
  });

  const token = createJwtToken(userId);
  res.status(200).json({ token, userId });
}

export async function login(req, res) {
  const { user_id, user_pw } = req.body;
  const user = await userRepository.findByUserId(user_id);
  console.log(user);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const isValidPassword = await bcrypt.compare(user_pw, user.user_pw);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const token = createJwtToken(user.user_id);
  res.status(200).json({ token, user_id });
}

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}
