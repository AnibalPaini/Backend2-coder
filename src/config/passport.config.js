import passport from "passport";
import jwtStrategy from "passport-jwt";
import userModel from "../services/db/models/user.model.js";
import Cart from "../services/db/models/carts.model.js";
import { cookieExtractor, isValidPassword, PRIVATE_KEY_TOKEN, generateHash } from "../utils.js";

//Declarar estrategia


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