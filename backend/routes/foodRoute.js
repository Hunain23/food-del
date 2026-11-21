import express from "express"
import { addFood,listfood,removefood } from "../controllers/foodController.js"
import multer from "multer"
import fs from "fs"

const foodRouter=express.Router();

// Image Storage Engine
// On Vercel / serverless, filesystem is read-only except /tmp
const uploadDir = process.env.VERCEL ? "/tmp" : "uploads";
if (!process.env.VERCEL && !fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.get('/list',listfood)
foodRouter.post('/remove',removefood)

export default foodRouter

















