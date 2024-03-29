import express from 'express';

import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import tokenBearer from 'express-bearer-token';
import helmet from 'helmet';
import morgan from 'morgan';
import { join } from 'path';

import connect from './utils/db/connection.js';
import log from './utils/logger/log.js';
import auth from './utils/middlewares/auth.js';

import globalRoute from './controllers/global.js';
import apiRoute from './controllers/api.js';
import tokenRoute from './controllers/token.js';
import translateRoute from './controllers/translate.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const db = connect(
  process.env.DB_URL,
  { useNewUrlParser: true }
);

class Client {
  constructor(options = {}) {
    this.options = options;
    this.log = log;
  }

  start(port = this.options.port || process.env.PORT || 3000) {
    app.enable('trust proxy', true);

    app.disable('view cache');
    app.set('view engine', 'ejs');
    app.set('views', join(__dirname, './../views'));

    app.use(morgan('combined'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(helmet());
    app.use(compression());
    app.use(cors());
    app.use(tokenBearer());
    app.use(
      rateLimit({
        windowMs: 10000,
        max: 50,
        headers: true,
        handler: (req, res) => {
          res.status(429).json({ code: 429, message: 'Too many requests' });
        },
      })
    );

    app.use(express.static('public'));
    app.use('/api/v1/token', tokenRoute);
    app.use('/api/v1/translate', auth, translateRoute);
    app.use('/api/v1', apiRoute);
    app.use('/', globalRoute);

    app.listen(port, () => {
      this.log(`Listening on port ${port}`, 'API');
    });
  }
}

export default Client;
