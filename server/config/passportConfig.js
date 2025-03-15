import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import bcrypt from 'bcrypt';

import { BuyerLoginData } from "../../public/MockData.js";
import { BooksDataArray } from "../../public/MockData.js";




// passport.use('buyer-local', new Strategy(function verify(username, password, cb) {
//   try {
//     const BuyerCopy = BuyerLoginData.find((Copy) => username == Copy.username);
//     if (BuyerCopy == undefined) {
//         console.log('userNotFound');
//       return cb('user not found');
//     }
//     else {
//       bcrypt.compare(password, BuyerCopy.password, (err, valid) => {
//         if (err){
//             console.log('error');
//             return cb(err);
//         }
//         else {
//           if (valid) {
//             return cb(null, true);
//           }
//           else{
//             console.log("wrong password");
//             return cb(null, false);
//           }
//         }
//       })
//     }
//   }
//   catch (err) {
//     console.log(err);
//     return cb(err);
//   }
// }));



// passport.serializeUser((user, cb) => {
//     cb(null, user);
// });

// passport.deserializeUser((user, cb) => {
//     cb(null, user);
// });



passport.use('local', new Strategy({ usernameField : 'email'}, async function verify(username, password, cb) {
  // console.log('came to passport use');
    try {
      const BuyerCopy = BuyerLoginData.find((Copy) => username == Copy.email);
      if(BuyerCopy == undefined) {
        console.log('userNotFound');
        return cb(null, false, {message : 'user not found'});
      }
      else {
        // bcrypt.compare(password, BuyerCopy.password, (err, valid) => {
        //   if (err){
        //       console.log('error');
        //       return cb(err);
        //   }
        //   else {
        //     if (valid) {
        //       return cb(null, true);
        //     }
        //     else{
        //       console.log("wrong password");
        //       return cb(null, false);
        //     }
        //   }
        // })
        console.log('hi 1');
        console.log(BuyerLoginData);
        if(password == BuyerCopy.password){
          console.log('CORRECT');
          return cb(null, BuyerCopy);
        }
        else{
          console.log('WRONG');
          return cb(null, false, {message : 'incorrect password'});
        }
      }
    }
    catch (err) {
      console.log(err);
      return cb(err);
    }
  }));
  
  
  
  passport.serializeUser((user, cb) => {
      cb(null, user);
  });
  
  passport.deserializeUser((user, cb) => {
    // try {
    //   const user = BuyerLoginData.find((u) => u.id === id);
    //   cb(null, user);
    // } catch (err) {
    //   cb(err);
    // }
    cb(null, user);
  });
  