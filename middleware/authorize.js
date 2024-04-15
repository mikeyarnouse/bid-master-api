const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const bearerTokenString = req.headers.authorization;

  if (!bearerTokenString) {
    return res.status(401).json({ error: "Please Log In" });
  }

  const splitBearerTokenString = bearerTokenString.split(" ");

  if (splitBearerTokenString.length !== 2) {
    return res.status(400).json({ error: "Bearer token is malformed" });
  }

  const token = splitBearerTokenString[1];

  // console.log("token: ", token);
  // console.log("secret key: ", process.env.SECRET_KEY);

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid JWT" });
    }
    req.user = decoded;
    console.log("user: ", req.user);
    next();
  });
};
