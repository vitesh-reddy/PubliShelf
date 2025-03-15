import express from "express";
import mockPublisherData from "../../public/mockPublisherData.js";
<<<<<<< HEAD

const router = express.Router();

router.get("/dashboard", (req, res) =>{
    if(req.isAuthenticated()){
        console.log(req.user);
        console.log("first Name ", req.user.firstname)
        res.render("publisher/dashboard", { sales: mockPublisherData ,PublisherName : req.user.firstname });
    }
    else res.redirect('/auth/login');
}
);
router.get("/signup", (req, res) =>{
    res.render("auth/signup-publisher")
});

router.get("/publish-book", (req, res) => {
    if(req.isAuthenticated()){
    res.render("publisher/publishBook");
    }
    else res.redirect('/auth/login');
});

router.get("/sell-antique", (req, res) => {
    if(req.isAuthenticated()){
    res.render("publisher/sellAntique");
    }
    else res.redirect('/auth/login');
});


import { BooksDataArray, BuyerLoginData } from "../../public/MockData.js";


router.post('/signup', (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const publishingHouse = req.body.publishingHouse;
    const businessEmail = req.body.businessEmail;
    const password = req.body.password;
    const BuyerRegisterCopy = BuyerLoginData.find((Copy) => businessEmail == Copy.email);

    if(BuyerRegisterCopy != undefined){
        res.redirect('/auth/login');
    }
    else{
        const copyy = {
            id: BuyerLoginData.length + 1,
            role: 'publisher',
            firstname : firstname,
            lastname : lastname,
            housename : publishingHouse,
            email: businessEmail,
            password: password,
        };
        BuyerLoginData.push(copyy);
        res.redirect('/auth/login');
    }

})

router.post('/publish-book', (req, res) => {
    const bookTitle = req.body.bookTitle;
    const author = req.body.author;
    const description = req.body.description;
    const genre = req.body.genre;
    const price = req.body.price;
    const quantity = parseInt(req.body.quantity, 10);
    const image = req.body.image;

    const copyFind = BooksDataArray.find((obj) => {
        if(bookTitle == obj.bookTitle && author == obj.author && description == obj.description && genre == obj.genre && price == obj.price && image == obj.image){
            return obj;
        }
    });

    if(!copyFind){
        const BookObject = {
            bookTitle : bookTitle,
            author : author,
            description : description,
            genre : genre,
            price : price,
            quantity : quantity,
            image : image,
        };
        BooksDataArray.push(BookObject);
    }
    else{
        copyFind.quantity = parseInt(copyFind.quantity, 10) + quantity;
    }

    console.log(BooksDataArray);
    res.redirect('/publisher/dashboard');
})
=======
const router = express.Router();

router.get("/dashboard", (req, res) =>
  res.render("publisher/dashboard", { sales: mockPublisherData })
);
router.get("/publish-book", (req, res) => res.render("publisher/publishBook"));
router.get("/sell-antique", (req, res) => res.render("publisher/sellAntique"));
>>>>>>> 3dbf591fb5f3493eebab8f405f15486fc9e23601

export default router;
