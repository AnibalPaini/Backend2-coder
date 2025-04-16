import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const generateHash= (password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword=(user, password)=>{
    console.log(`Datos a validar user-password-db: ${user.password}, password-Cliente: ${password}`);
    return bcrypt.compareSync(password, user.password);
}

export const PRIVATE_KEY_TOKEN= "ClaveSecretaToken"
export const generateToken=(user)=>{
    return jwt.sign({user},PRIVATE_KEY_TOKEN, {expiresIn:"24h"} )
}


export const passportCall =(strategy)=>{
    return async(req,res, next)=>{
        console.log("Entrando en la estrategia: ");
        console.log(strategy);
        
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
    console.log("CookieExtractor");
    console.log("req.cookies", req.cookies);

    if (req && req.cookies) {
        console.log("Cookies presentes: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken'];


        console.log("Token obtenido desde Cookie:");
        console.log(token);
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