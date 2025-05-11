import { verifyToken } from "../utils/jwt.js";

export const protect = (req, res, next) => {
  const token = req.cookies.token; // Extract the token from cookies
  if (!token) {
    return res.redirect("/auth/login");
  }

  try {
    const decoded = verifyToken(token); // Decode the token
    req.user = decoded; // Attach user info to the request object
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