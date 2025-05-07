import bcrypt from "bcrypt";
import Buyer from "../models/Buyer.js";
import Publisher from "../models/Publisher.js";
import { generateToken } from "../utils/jwt.js";

export const loginUser = async (email, password) => {
  try {
    // Check if the user exists in Buyer or Publisher collections
    const buyerUser = await Buyer.findOne({ email });
    const publisherUser = await Publisher.findOne({ email });
    let user = undefined;
    if (buyerUser) user = { ...buyerUser.toObject(), role: "buyer" };
    else if (publisherUser) user = { ...publisherUser.toObject(), role: "publisher" };
    // If user is found in either collection, use that user
    else return { token: null, user: null, code: 403}; // User not found

    // Validate the password

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { token: null, user: null, code: 401}; // Invalid password
    }
    
    // Generate JWT token
    const token = generateToken(user);

    console.log(user.firstname, user.lastname, "logged in as ", user.role);

    // Return the token and user details
    return { token, user, code: 0 };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw new Error("Error logging in user");
  }
};

/**
 * Login a user (Buyer or Publisher)
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {object} - Returns an object containing the token and user details
 */
