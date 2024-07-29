import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

function required(key, defaultValue = undefined) {
  const value = eval(`process.env.${key}`) || defaultValue;
  if (value == null) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  port: {
    port: parseInt(required('PORT', 8000)),
  },
  cors: {
    allowedOrigin: required('CORS_ALLOWED_ORIGIN'),
  },
  db: {
    host: required('DB_HOST'),
    port: parseInt(required('DB_PORT')),
    user: required('DB_USER'),
    database: required('DB_DATABASE'),
    password: required('DB_PASSWORD'),
  },
  jwt: {
    secretKey: required('JWT_SECRET'),
    expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12)),
  },
  kakao: {
    restApiKey: required('KAKAO_RESTAPI_KEY'),
    redirectUrl: required('KAKAO_REDIRECT_URL'),
  },
};
