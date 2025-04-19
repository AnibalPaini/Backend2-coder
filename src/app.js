import express from "express"
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js" 
import __dirname from "./utils.js";
import config from "./config/config.js";
import initializeMongoService from "./services/db/connectDB.js"


import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

//Routes
import usersViewRouter from "./routes/userViews.router.js"
import sessiosRouter from "./routes/sessions.router.js"

const app=express();

//JSON config
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Handlebars config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');

//Public
app.use(express.static(__dirname+"/public"))

//Middlewares Passport
initializePassport();
app.use(passport.initialize())

//cookieParser
app.use(cookieParser("ClaveSecreta"))

//endpoints
app.use("/users", usersViewRouter); //<== perfil del usuario, formularios
app.use("/api/sessions", sessiosRouter);//<-- apis de register y login
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

initializeMongoService();

app.listen(config.port,()=>{
    console.log("http://localhost:"+config.port);
});