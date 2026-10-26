const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hashforge_super_secret_key');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
