/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const authError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return authError(res);
    // return res.status(401).send({ message: 'тут ошибка' });
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
