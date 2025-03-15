import express from "express";
import mockBuyerData from "../../public/mockBuyerData.js";
import styles from "../../public/css/styles.js";
import bodyParser from "body-parser";
import passport from "passport";
import '../../server.js';
import '../config/passportConfig.js'
import { BooksDataArray } from "../../public/MockData.js";
import { BuyerLoginData } from "../../public/MockData.js";

const router = express.Router();
router.use(bodyParser.urlencoded({extended:true}));

router.get("/dashboard", (req, res) => {

    // console.log(req.user.username);
    
  if(req.isAuthenticated()){
    // const copy = BuyerLoginData.find((cp) => user == cp.username);
    // Myname = copy.lastname;
    console.log(req.user);
    res.render("buyer/dashboard", { books: mockBuyerData, styles: styles, buyerName : req.user.firstname })
  }
  else res.redirect('/auth/login');
}
);

router.get("/signup", (req, res) => res.render("auth/signup-buyer"));
 

//zzz
// router.get('/logout', (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.redirect('/');
//   })
// });






router.post('/signup', (req, res) => {
  const username = req.body.email;
  const password = req.body.password;
  const BuyerRegisterCopy = BuyerLoginData.find((Copy) => username == Copy.email);
  console.log('came to buyer signup');
  if (BuyerRegisterCopy != undefined) {
    res.redirect('/auth/login');
  }
  else {
    // bcrypt.hash(password, 10, (err, hash) => {
      // if (err) {
      //   console.log('Error while hashing : ', err);
      // }
      // else {
        const newRegister = {
          id: BuyerLoginData.length + 1,
          role: 'buyer',
          firstname : req.body.firstname,
          lastname : req.body.lastname,
          email: username,
          password: password,
        }
        BuyerLoginData.push(newRegister);
        console.log(newRegister);
        console.log(BuyerLoginData);
        res.redirect('/auth/login');
      // }
    // })
  }
});



// router.post('/login', passport.authenticate('buyer-local', {
//   successRedirect: '/buyerdashboard',
//   failureRedirect: '/login'
// }));



export default router;
