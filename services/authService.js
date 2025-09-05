import bcrypt from "bcrypt";
import Buyer from "../models/Buyer.js";
import Publisher from "../models/Publisher.js";
import { generateToken } from "../utils/jwt.js";

export const loginUser = async (email, password) => {
  try {    
    const buyerUser = await Buyer.findOne({ email });
    const publisherUser = await Publisher.findOne({ email });
    let user = undefined;
    if (buyerUser) user = { ...buyerUser.toObject(), role: "buyer" };
    else if (publisherUser) user = { ...publisherUser.toObject(), role: "publisher" };    
    else return { token: null, user: null, code: 403}; 
    

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { token: null, user: null, code: 401};
    }
        
    const token = generateToken(user);

    console.log(user.firstname, user.lastname, "logged in as", user.role);
    
    return { token, user, code: 0 };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw new Error("Error logging in user");
  }
};