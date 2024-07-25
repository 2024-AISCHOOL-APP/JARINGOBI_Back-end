import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import { sequelize } from './db/database.js';
import authRouter from './router/auth.js';
import communityRouter from './router/community.js';
import accountRouter from './router/account.js';
import { kakaoLogin } from './controller/auth.js';

const app = express();

const corsOptions = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.get('/', (req, res, next) => {
  res.sendStatus(200);
  return '서버 홈';
});

app.use('/auth', authRouter);
app.get('/oauth/callback/kakao', kakaoLogin);
app.use('/community', communityRouter);
app.use('/account', accountRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

sequelize
  .sync()
  .then(() => {
    console.log('서버 열림');
    app.listen(config.port.port);
  })
  .catch((err) => console.log(err));

process.on('SIGTERM', async () => {
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await sequelize.close();
  process.exit(0);
});
