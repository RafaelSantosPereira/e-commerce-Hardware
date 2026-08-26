const jwt = require('jsonwebtoken');

function getCookieValue(cookieHeader, name) {
  const cookie = cookieHeader
    ?.split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

function authenticateToken(req, res, next) {
  const token = getCookieValue(req.headers.cookie, 'authToken');

  if (!token) {
    return res.status(401).json({ message: 'Precisa estar logado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
