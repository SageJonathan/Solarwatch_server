
import axios from "axios";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const weatherBaseURL = process.env.WEATHER_BASE_URL; 
const weatherAPIKey = process.env.WEATHER_API_KEY;

// router.get('/', async (req, res) => {
//     const { lat, lng } = req.query;

//     if (!lat || !lng) {
//         return res.status(400).json({ error: 'Latitude and longitude are required' });
//     }
// }

export default router;


