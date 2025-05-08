import jwt from "jsonwebtoken";

export const generateToken = (user) => {
<<<<<<< HEAD
  const payload = {
    id: user._id,
    role: user.role,
    firstname: user.firstname, // Include firstname
    lastname: user.lastname,   // Include lastname
    email: user.email,         // Include email
  };
=======
  const payload = { id: user.id, role: user.role };
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
