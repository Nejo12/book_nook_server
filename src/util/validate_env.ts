import { cleanEnv, port, str } from 'envalid';

export default cleanEnv(process.env, {
  MONGODB_URI: str(),
  JWT_SECRET: str(),
  COOKIE_KEY: str(),
  PORT: port(),
});
