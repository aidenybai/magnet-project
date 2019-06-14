import tokenModel from './../../models/token.js';

const auth = (req, res, next) => {
  tokenModel.findOne({ token: req.token }).then((token) => {
    if (token) {
      next();
    }
    else {
      res.status(401).json({ code: 401, message: 'Invalid Authentication Token' });
    }
  });
};

export default auth;