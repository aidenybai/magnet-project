import { Router } from 'express';

import tokenModel from './../models/token.js';
import token from './../utils/middlewares/token.js';

const router = Router();

router.get('/', async (req, res) => {
  const apiToken = await token();

  tokenModel
    .create({ token: apiToken })
    .then(() => res.status(200).json({ code: 200, message: apiToken }))
    .catch(() => res.status(500));
});

export default router;
