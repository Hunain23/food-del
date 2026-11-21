import { log } from "console";
import foodModel from "../models/foodModel.js";
import fs from 'fs'


//Add food item

const addFood = async  (req,res)=>{
try {
    if (!req.file) {
        return res.json({ success: false, message: "Image file is required" });
    }

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        category: req.body.category,
        image: image_filename
    });

    await food.save();
    res.json({success:true,message:"Food Added"})
} catch (error) {
    console.log(error)
    res.json({success:false,message: error.message || "Error adding food"})
}
}


//all food list   

const listfood = async (req,res) =>{
try {
    const foods = await foodModel.find({});
    res.json({success:true,data:foods})
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
}
}

// remove fooditem

const removefood = async (req,res) =>{
try {
    const food = await foodModel.findById(req.body.id);
    const uploadDir = process.env.VERCEL ? "/tmp" : "uploads";
    fs.unlink(`${uploadDir}/${food.image}`,()=>{

    })
    await foodModel.findByIdAndDelete(req.body.id)
    res.json({success:true,message:"Food Removed"})
} catch (error) {
    console.log(error)
    res.json({success:false,message:'Error'})
}
}



export {addFood,listfood,removefood}
