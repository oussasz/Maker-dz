import jwt from "jsonwebtoken";


export function authenticateUser(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Authentication required - No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      console.error("Error authenticating user:", error);
      return res.status(401).json({ error: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      console.error("Error authenticating user:", error);
      return res.status(403).json({ error: "Token expired" });
    } else {
      console.error("Error authenticating user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
