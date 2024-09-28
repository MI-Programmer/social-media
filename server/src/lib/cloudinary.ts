import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: "du7cebhxj",
  api_key: "415935322444999",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
