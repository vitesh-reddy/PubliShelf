import { verifyToken } from "../utils/jwt.js";

export const protect = (req, res, next) => {
  const token = req.cookies.token; // Extract the token from cookies
<<<<<<< HEAD
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
=======
  console.log("reqqq", req.parser);
  console.log("Inside protect middleware");
  if (!token) 
    return res.redirect("/auth/login");
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user info to the request object
    next();

    console.log("User role:", req.user.role);
  } catch (error) {
    // Redirect logged-in users to their respective dashboard

    if (req.user && req.user.role === "publisher")
      return res.redirect("/publisher/dashboard");
    else if (req.user && req.user.role === "buyer")
      return res.redirect("/buyer/dashboard");
    else return res.redirect("/"); // Redirect to landing page if not logged in
  }
};

>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94

/*
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies.token; // Extract the token from cookies

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user to the request object
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
*/