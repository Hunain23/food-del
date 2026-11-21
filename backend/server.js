import "dotenv/config"
import express from "express"
import cors from "cors"
import path from "path"
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

const setStaticHeaders = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
    next()
}

app.use("/images", setStaticHeaders, express.static(path.join(__dirname, 'public', 'images')))
app.use("/images", setStaticHeaders, express.static(path.join(__dirname, 'uploads')))
if (process.env.VERCEL) {
    app.use("/images", setStaticHeaders, express.static('/tmp'))
}

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


