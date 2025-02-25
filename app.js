const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const routes = require('./server/routes/projectRoutes.js')
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({extended : true}));          //body-parser middleware
app.use(express.static('public'));
app.use(expressEjsLayouts);

app.set('layout', './layout/main');
app.set('view engine', 'ejs');


app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});