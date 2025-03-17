import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import bcrypt from "bcrypt";

import { BuyerLoginData } from "../../public/mockData/MockUserData.js";
import { BooksDataArray } from "../../public/mockData/MockUserData.js";

passport.use(
  "local",
  new Strategy({ usernameField: "email" }, async function verify(
    username,
    password,
    cb
  ) {
    try {
      const BuyerCopy = BuyerLoginData.find((Copy) => username == Copy.email);
      if (BuyerCopy == undefined)
        return cb(null, false, { message: "user not found" });
      else {
        if (password == BuyerCopy.password) return cb(null, BuyerCopy);
        else return cb(null, false, { message: "incorrect password" });
      }
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});