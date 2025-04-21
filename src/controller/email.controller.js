import config from "../config/config.js";
import nodemailer from "nodemailer"
import __dirname from "../utils.js"


//Cofig transporter
export const transporter= nodemailer.createTransport({
    service: "gmail",
    port:587,
    auth:{
        user:config.gmailAcc,
        pass:config.gmailPass
    }
})


transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    }else{
        console.log("Conexion realizada con gmail");
    }
})





