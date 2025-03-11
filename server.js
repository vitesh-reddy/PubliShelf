import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import path from "path";
import { fileURLToPath } from "url";
console.clear();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
import { mockData } from "./public/mockData.js";
import buyerRouter from "./server/routes/buyerRoutes.js";
import styles from "./public/css/styles.js";

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));



//START OF LOGIN REGISTER

const BuyerLoginData = [
  {
    id: 1,
    role: 'Buyer',
    username: 'hello@gmail.com',
    password: '1234',
  }
];

const SellerLoginData = [
  {
    id: 1,
    role: 'Seller',
    username: 'hi@gmail.com',
    password: '1234',
  }
];



app.use(session({
  secret: "ULAALAA" || process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60,
  }
}));

app.use(passport.initialize());
app.use(passport.session());



// Buyer login register logout

app.get('/buyer/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  })
})


app.post('/buyer/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const BuyerRegisterCopy = BuyerLoginData.find((Copy) => username == Copy.username);
  if (BuyerRegisterCopy != undefined) {
    res.redirect('/buyer/login');
  }
  else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.log('Error while hashing : ', err);
      }
      else {
        const newRegister = {
          id: BuyerLoginData.length + 1,
          role: 'Buyer',
          username: username,
          password: hash,
        }
        BuyerLoginData.push(newRegister);
        console.log(newRegister);
        res.redirect('/buyerdashboard');
      }
    })
  }
});


app.post('/buyer/login', passport.authenticate('buyer-local', {
  successRedirect: '/buyerdashboard',
  failureRedirect: '/buyer/login'
}));

passport.use('buyer-local', new Strategy(function verify(username, password, cb) {
  try {
    const BuyerCopy = BuyerLoginData.find((Copy) => username == Copy.email);
    if (BuyerCopy == undefined) {
      return cb('user not found');
    }
    else {
      bcrypt.compare(password, BuyerCopy.password, (err, valid) => {
        if (err) return cb(err);
        else {
          if (valid) {
            return cb(null, true);
          }
          else return cb(null, false);
        }
      })
    }
  }
  catch (err) {
    return cb(err);
  }
}));



// Seller login register logout


app.get('/seller/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  })
})


app.post('/buyer/register', (req, res) => {
  const username = req.body.username1;
  const password = req.body.password1;
  const BuyerRegisterCopy = BuyerLoginData.find((Copy) => username == Copy.username);
  if (BuyerRegisterCopy != undefined) {
    res.redirect('/seller/login');
  }
  else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.log('Error while hashing : ', err);
      }
      else {
        const newRegister = {
          id: SellerLoginData.length + 1,
          role: 'Seller',
          username: username,
          password: hash,
        }
        SellerLoginData.push(newRegister);
        console.log(newRegister);
        res.redirect('/sellerdashboard');
      }
    })
  }
});


app.post('/seller/login', passport.authenticate('seller-local', {
  successRedirect: '/sellerdashboard',
  failureRedirect: '/seller/login'
}));

passport.use('seller-local', new Strategy(function verify(username1, password1, cb) {
  try {
    const BuyerCopy = SellerLoginData.find((Copy) => username1 == Copy.email);
    if (BuyerCopy == undefined) {
      return cb('user not found');
    }
    else {
      bcrypt.compare(password1, BuyerCopy.password, (err, valid) => {
        if (err) return cb(err);
        else {
          if (valid) {
            return cb(null, true);
          }
          else return cb(null, false);
        }
      })
    }
  }
  catch (err) {
    return cb(err);
  }
}));








passport.serializeUser((user, cb) => {
  cb(null, { id: user.id, role: user.role });
});

passport.deserializeUser(async (obj, cb) => {
  try {
    let user;
    if (obj.role === "Seller") {
      user = SellerLoginData.find((copy) => copy.id == obj.id);
    } else {
      user = BuyerLoginData.find((copy) => copy.id = obj.id);
    }
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});














//END OF LOGIN REGISTER


// Routes
app.get("/", (req, res) => {
  res.render("index", { books: mockData, styles: styles });
});

app.use("/buyer", buyerRouter);
// app.get("/buyer/dashboard", (req, res) => {
//   res.render("buyer/dashboard", { books: mockData });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
