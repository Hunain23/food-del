import express from "express"
import { addFood, listfood, removefood } from "../controllers/foodController.js"
import multer from "multer"

const foodRouter = express.Router();

// Memory Storage: stores file as buffer in memory (zero filesystem dependency for serverless)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get('/list', listfood);
foodRouter.post('/remove', removefood);

export default foodRouter;
