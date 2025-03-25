import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
const urlMongo=process.env.MONGO_URL;

const connectMongoDB= async()=>{
    try {
        await mongoose.connect(urlMongo)
        console.log("Conectado MongoDB!");
    } catch (error) {
        console.log(error);
        process.exit()
    }
}

export default connectMongoDB;