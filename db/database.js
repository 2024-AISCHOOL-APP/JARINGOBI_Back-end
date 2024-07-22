import SQ from 'sequelize';
import { config } from '../config.js';

const { host, user, database, password, port } = config.db;

export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  port,
  dialect: 'mysql',
});
