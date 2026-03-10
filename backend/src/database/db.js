import mongoose from "mongoose";

export const connectDb= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongoose connected successfully");
    }
    catch(error){
        console.log("mongoose connection failed" , error.message);
        process.exit(1);
    }
}