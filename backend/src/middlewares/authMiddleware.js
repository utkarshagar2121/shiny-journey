import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token,access denied",
      });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; //attach user id to the request
    next();
  } catch (error) {
    console.log("error while authMiddleware  == ", error.message);
    res.status(401).json({ message: "invalid token" });
  }
};
