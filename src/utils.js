import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import passport from "passport";
import config from './config/config.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const generateHash= (password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword=(user, password)=>{
    return bcrypt.compareSync(password, user.password);
}

export const generateToken=(user)=>{
    return jwt.sign({user},config.JWT, {expiresIn:"24h"} )
}


export const passportCall =(strategy)=>{
    return async(req,res, next)=>{
        passport.authenticate(strategy, function(error,user,info){
            if(error) return next(error);
            if(!user){
                console.log("no encontrado!");
                return res.status(401).send({error:info.messages ? info.messages : info.toString()})
            }
            console.log("Usuario obtenido del strategy: ");
            console.log(user);
            req.user=user;
            next();
            
        })(req,res,next)
    }
}

export const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwtCookieToken'];
    }

    return token;
}

export const authorization=(role)=>{
    return async(req,res,next)=>{
        if(!req.user)return res.status(400).send({message:"User not found!"})
    
        if(req.user.role!==role)return res.status(401).send({message:"Unauthorized!"})
            
        next();
    }
}

export const checkIfLoggedIn = (req, res, next) => {
    if (req.cookies && req.cookies.jwtCookieToken) {
      passport.authenticate("jwt", { session: false }, (error, user) => {
        if (error || !user) {
          return next();
        }
        req.user = user;  
        next();
      })(req, res, next);
    } else {
      return next();  
    }
  };