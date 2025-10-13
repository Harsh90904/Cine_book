const jwt = require("jsonwebtoken");

const decode = (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization);
  const token = req.headers?.authorization?.split(" ")[1];
console.log("wow", req.body);

  if (token) {
    console.log(token);
    
    jwt.verify(token, "private-key", (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
      req.user = decoded;
      console.log(decoded);
      next();
    });
  } else {
    res.status(401).json({ error: "Token not provided" });
  }
};


module.exports = { decode };
