import express from "express"
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js" 
import session from "express-session";
import MongoStore from "connect-mongo";
import __dirname from "./utils.js";
import dotenv from "dotenv"
import connectMongoDB from "./db/db.js";

import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

//Routes
import usersViewRouter from "./routes/userViews.router.js"
import sessiosRouter from "./routes/sessions.router.js"


const app=express();

//Dotenv variables de entorno
dotenv.config()

//JSON config
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Handlebars config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');

//Public
app.use(express.static(__dirname+"/public"))

//Sessions para guardar en mongo
const urlMongo=process.env.MONGO_URL;
app.use(session({
    store:MongoStore.create({
        mongoUrl:urlMongo,
        ttl:60
    }),
    secret:"Cod3rSecret",
    resave:false,
    saveUninitialized:true
}))

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


//DB
connectMongoDB();

const SERVER_PORT= process.env.PORT;
app.listen(SERVER_PORT,()=>{
    console.log("http://localhost:8080");
});