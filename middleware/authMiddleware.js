import { verifyToken } from "../utils/jwt.js";

export const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/auth/login");
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.redirect("/auth/login");
  }
};

export const checkAdminKey = (req, res, next) => {
  if (req.params.key === "123456") next();
  else res.status(401).send("Unauthorized access");
};