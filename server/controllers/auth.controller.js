//controllers/auth.controller.js
import { loginUser } from "../services/auth.services.js";

export const loginPostController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        data: null
      });
    }

    const result = await loginUser(email, password);

    if (result.code !== 0) {
      const status = result.code === 401 ? 401 : 403;
      const message = result.code === 401 ? "Invalid password" : "User not found";
      return res.status(status).json({
        success: false,
        message,
        data: null
      });
    }

    // Set JWT cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours; align with JWT_EXPIRES_IN
    });

    console.log(result.user.firstname, result.user.lastname, "logged in as", result.user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: result.user }
    });
  } catch (error) {
    console.error("Error in loginPostController:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null
    });
  }
};