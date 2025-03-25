import passport from "passport";
import mongoose from "mongoose";
import passportLocal from "passport-local";
import jwtStrategy from "passport-jwt";
import userModel from "../model/user.model.js";
import Cart from "../model/carts.model.js";
import { cookieExtractor, isValidPassword, PRIVATE_KEY_TOKEN, generateHash } from "../utils.js";

//Declarar estrategia
const localStrategy= passportLocal.Strategy;

//JWT config
const JwtStrategy= jwtStrategy.Strategy;
const ExtractJWT =jwtStrategy.ExtractJwt;

const initializePassport=()=>{

    //JWT
    passport.use("jwt", new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),//extraemos el token de las cookies
            secretOrKey:PRIVATE_KEY_TOKEN,
        }, async(jwt_payload, done)=>{
            try {
                console.log(jwt_payload);
                return done(null, jwt_payload.user);
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    ))


    //Estrategia local de registro
    //Nombre de estrategia - inicializamos la estrategia
    passport.use("register",new localStrategy(
        {
            passReqToCallback:true, //permite acceder al objeto req dentro de la funcion de auntenticacion
            usernameField:"email", //Definimos que el username sera el campo email en la BDD
        },
        async (req,username,password,done)=>{
            const {first_name,last_name,email,age}=req.body;
            try {
                const existUser= await userModel.findOne({email});
                if (existUser){
                    console.log("Usuario ya registrado!");
                    return done(null, false)
                }

                const newCart = await Cart.create({ products: [] });

                let newUser={
                    first_name,
                    last_name,
                    email,
                    age,
                    password:generateHash(password),
                    cart: newCart._id
                }
                const result = await userModel.create(newUser)
                done(null, result)
            } catch (error) {
                return done("Error en el registro! "+error);
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });
}

export default initializePassport;