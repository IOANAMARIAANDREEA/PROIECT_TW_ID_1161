const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists. Please log in again." });
    }
    req.user = { id: user.id, email: user.email, name: user.name };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
