import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config.js';
import * as userRepository from '../data/auth.js';
import axios from 'axios';

const kakao = {
  clientId: config.kakao.restApiKey,
  redirect_uri: config.kakao.redirectUrl,
};

export async function signup(req, res) {
  const { id, pw, name, nick, email, addr, gender } = req.body;
  const found = await userRepository.findByUserId(id);
  if (found) {
    return res.status(409).json({ message: `${id} already exists` });
  }
  const hashed = await bcrypt.hash(pw, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    id,
    pw: hashed,
    name,
    nick,
    email,
    addr,
    gender,
    classification: '사용자',
  });

  const token = createJwtToken(userId);
  res.status(200).json({ token, userId });
}

export async function login(req, res) {
  const { id, pw } = req.body;
  const user = await userRepository.findByUserId(id);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const isValidPassword = await bcrypt.compare(pw, user.pw);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const token = createJwtToken(user.id);
  res.status(200).json({ token, id });
  console.log('로그인 성공!');
}

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

export async function kakaoLogin(req, res) {
  const code = req.query.code;
  try {
    const tokenData = await getAccessToken(code);
    const userInfo = await getUserInfo(tokenData.access_token);

    const { data } = userInfo;
    const nickName = data.properties.nickname;
    const email = data.kakao_account.email;
    const kakaoId = data.id;

    if (!nickName || !email || !kakaoId) throw new Error('KEY_ERROR', 400);

    const user = await userRepository.findByUserId(kakaoId);

    if (!user) {
      return res.status(204).json({ message: `존재하지 않는 회원입니다.` });
    }

    const token = createJwtToken(kakaoId);
    res.status(200).json({ token, kakaoId });
  } catch (error) {
    console.error('Error during kakao login process');
    res.status(500).send('Error during kakao login process');
  }
}

const getAccessToken = async (code) => {
  const tokenUrl = 'https://kauth.kakao.com/oauth/token';
  const data = {
    grant_type: 'authorization_code',
    client_id: kakao.clientId,
    redirect_uri: kakao.redirect_uri,
    code: code,
  };
  try {
    const response = await axios.post(
      tokenUrl,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: data,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching access token : ', error);
  }
};

const getUserInfo = async (accessToken) => {
  console.log(accessToken);
  const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
  try {
    const response = await axios.get(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info');
  }
};

export async function me(req, res) {
  const user = await userRepository.findByUserId(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, userId: req.userId });
}

export async function logout(req, res) {
  setToken(res, '');
  res.sendStatus(200).json({ message: 'Logged out' });
}

function setToken(res, token) {
  const options = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: config.jwt.expiresInSec * 1000,
  };
  res.cookie('token', token, options);
}
