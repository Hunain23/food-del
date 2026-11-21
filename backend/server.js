import "dotenv/config"
import express from "express"
import cors from "cors"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//app config
const app = express ()
const port = process.env.PORT || 4000

//middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB();

//api end points
app.use("/api/food",foodRouter)

// Serve images with explicit fallback paths & cross-origin headers
app.get("/images/:filename", (req, res) => {
    const filename = req.params.filename;
    const candidates = [
        path.join(__dirname, "public", "images", filename),
        path.join(__dirname, "uploads", filename),
        path.join(process.cwd(), "public", "images", filename),
        path.join(process.cwd(), "uploads", filename),
        path.join(process.cwd(), "backend", "uploads", filename),
        path.join("/tmp", filename)
    ];

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    for (const filePath of candidates) {
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }
    }

    return res.status(404).json({ success: false, message: "Image not found" });
});

app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)


app.get('/',(req,res)=>{
    res.send("API Working")
})

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(port,()=>{
        console.log(`Server started on http://localhost:${port}`)
    })
}

export default app;



