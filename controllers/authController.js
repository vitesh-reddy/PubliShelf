import { verifyToken } from "../utils/jwt.js";
import { loginUser } from "../services/authService.js";

export const loginGetController = (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = verifyToken(token);

      // Redirect logged-in users to their respective dashboards
      if (decoded.role === "buyer") return res.redirect("/buyer/dashboard");
      else if (decoded.role === "publisher")
        return res.redirect("/publisher/dashboard");
      else if (decoded.role === "admin")
        return res.redirect("/admin/dashboard");
      else return res.redirect("/manager/dashboard");
    } catch (error) {
      // If token is invalid, proceed to login
      return res.render("auth/login");
    }
  } else {
    // If no token is provided, render the login page
    return res.render("auth/login");
  }
};

export const loginPostController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user, code } = await loginUser(email, password);

    if (code === 403) 
      return res.status(403).json({ message: "User not found" });
    else if (code === 401)    
      return res.status(401).json({ message: "Invalid password" });
    

    if (!token) return res.status(401).json({ message: "Invalid credentials" });

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      ok: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
