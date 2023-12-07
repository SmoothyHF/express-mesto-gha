/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const UnauthorizedError = require('../errors/unauthorized-error');

// const authError = (res) => {
//   res
//     .status(401)
//     .send({ message: 'Необходима авторизация' });
// };

const authError = (next) => {
  next(new UnauthorizedError('Необходима авторизация'));
};
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return authError(next);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return authError(res);
  }

  req.user = payload;

  next();
};
