import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from 'fs';
import path from 'path';

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, filename) => {
    return new Promise((resolve, reject) => {
        const cleanName = path.parse(filename).name.replace(/[^a-zA-Z0-9_-]/g, "_");
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "food-del",
                resource_type: "image",
                public_id: `${Date.now()}_${cleanName}`
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

// Add food item
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "Image file is required" });
        }

        let imageUrl = "";

        // If Cloudinary credentials are provided, upload to Cloudinary
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            imageUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        } else {
            // Local fallback if Cloudinary is not configured yet
            const uploadDir = process.env.VERCEL ? "/tmp" : "uploads";
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const cleanName = `${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
            fs.writeFileSync(path.join(uploadDir, cleanName), req.file.buffer);
            imageUrl = cleanName;
        }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            image: imageUrl
        });

        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.error("Error adding food:", error);
        res.json({ success: false, message: error.message || "Error adding food" });
    }
};

// List all foods
const listfood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message || "Error" });
    }
};

// Remove food item
const removefood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (food) {
            // If image is hosted on Cloudinary, remove from Cloudinary
            if (food.image && food.image.includes("cloudinary.com")) {
                try {
                    const parts = food.image.split('/');
                    const filenameWithExt = parts.pop();
                    const folder = parts.pop();
                    const publicId = `${folder}/${filenameWithExt.split('.')[0]}`;
                    await cloudinary.uploader.destroy(publicId);
                } catch (cErr) {
                    console.error("Cloudinary delete error:", cErr);
                }
            } else if (food.image) {
                // Local file unlink
                const uploadDir = process.env.VERCEL ? "/tmp" : "uploads";
                const filePath = path.join(uploadDir, food.image);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            await foodModel.findByIdAndDelete(req.body.id);
        }
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message || 'Error' });
    }
};

export { addFood, listfood, removefood };
