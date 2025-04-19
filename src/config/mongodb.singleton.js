import mongoose from "mongoose"
import config from "./config.js";

export default class MongoSingleton{
    static #intance;

    constructor(){
        this.#connectMongoDB()
    }

    static getInstance(){
        if(this.#intance){
            console.log("Ya se existe una conexión con MongoDB!");
            
        }else{
            this.#intance = new MongoSingleton();
        }
        return this.#intance
    }

    #connectMongoDB= async()=>{
        try {
            await mongoose.connect(config.mongoUrl);
            console.log("Conectado con MongoDB");
            
        } catch (error) {
            console.log("Error al conectarse a mongoDB: "+error);
            process.exit()
        }
    }
}