import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import session from "express-session";
import bcrypt from "bcrypt";
import passport from "passport";
import './server/config/passportConfig.js'
import { Strategy } from "passport-local";
// console.clear();
// import { json } from "body-parser";

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
import mockBuyerData from "./public/mockBuyerData.js";
import buyerRouter from "./server/routes/buyerRoutes.js";
import publisherRoutes from "./server/routes/publisherRoutes.js";
// import signupRouter from "./server/routes/signupRoutes.js";
import styles from "./public/css/styles.js";
import { BuyerLoginData } from "./public/MockData.js";


app.use(session({
  secret: "ULAALAA" || process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.render("index", { books: mockBuyerData, styles: styles });
});

app.get("/auth/login", (req, res) => {
  if(req.isAuthenticated()){
    if(req.user.role == 'buyer'){
      res.redirect('/buyer/dashboard');
    }
    else if(req.user.role == 'publisher'){
      res.redirect('/publisher/dashboard');
    }
    else if(req.user.role == 'admin'){
      res.redirect('/admin/dashboard');
    }
    else{
      res.redirect('/manager/dashboard');
    }
  }
  else{
    res.render("auth/login");
  }
});

app.use("/buyer", buyerRouter);
app.use("/publisher", publisherRoutes);
app.get("/about", (req, res) => res.render("about", { styles: styles }));
app.get("/contact", (req, res) => res.render("contact", { styles: styles }));




//START OF LOGIN REGISTER







app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local',  (err, user, info) => {
    console.log('came to pasport authenticate');
    if (err) {
      console.log("Authentication Error:", err);
      return next(err);
    }
    console.log('hi 2');
    console.log(BuyerLoginData);
    if (!user) {
      // console.log("Login Failed:", info.message);
      // return res.redirect('/auth/login');

      if(info.message == 'user not found'){
        console.log('403 in server');
        return res.status(403).json({key : 'user not found'});
      }
      else if(info.message == 'incorrect password'){
        console.log('401 in server');
        return res.status(401).json({key : 'incorrect password'});
      }
    }
    console.log(req.user)
    
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.log("Login Error:", loginErr);
        return next(loginErr);
      }
      console.log("Login Successful:", user);
      res.redirect('/buyer/dashboard');
      return res.status(200);
    });
  })(req, res, next);
});



app.get('/logout', (req, res) => {
  req.logout((err) => {
    if(err) return next(err);
    res.redirect('/');
  })
});







//END OF LOGIN REGISTER





app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});






















