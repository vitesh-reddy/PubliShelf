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
    
  if(req.isAuthenticated()){
    console.log(req.user);
    res.render("buyer/dashboard", { books: mockBuyerData, styles: styles, buyerName : req.user.firstname })
  }
  else res.redirect('/auth/login');
}
);

router.get("/signup", (req, res) => {
  if(req.isAuthenticated()){
    res.redirect('/auth/login');
    return;
  }
  res.render("auth/signup-buyer");
});

 


router.post('/signup', (req, res) => {
  if(req.isAuthenticated()){
      res.redirect('/auth/login');
      return;
  }
  const username = req.body.email;
  const password = req.body.password;
  const BuyerRegisterCopy = BuyerLoginData.find((Copy) => username == Copy.email);
  console.log('came to buyer signup');
  if (BuyerRegisterCopy != undefined) {
    res.redirect('/auth/login');
  }
  else {
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
  }
});



router.get("/dashboard", (req, res) =>
  res.render("buyer/dashboard", { books: mockBuyerData, styles: styles })
);

router.get("/signup", (req, res) => res.render("auth/signup-buyer"));

export default router;
