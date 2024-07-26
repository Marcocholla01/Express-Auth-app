const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/config");

const { db } = require(`../config/database`);
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

const authenticated = async (req, res, next) => {
  //   const token = req.cookies.access_token;
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Please login to continue" });
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const userQuery = "SELECT userId, role FROM users WHERE userId = ?";
    const userResult = await query(userQuery, [decoded.userId]);

    if (userResult.length === 0) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.auth = { userId: userResult[0].userId, role: userResult[0].role };
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        success: false,
        message: `Account with ${req.user.role} roles can not access this resource`,
      });
    }
    // Proceed to the next middleware or route handler
    next();
  };
};

module.exports = { authenticated, isAdmin };
