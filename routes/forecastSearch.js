import axios from "axios";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const weatherBaseURL = process.env.WEATHER_BASE_FORECAST_URL;
const weatherAPIKey = process.env.WEATHER_API_KEY;

router.get('/', async (req, res) => {
    console.log("HIT");  

    const { lat, lng } = req.query;
    console.log("Received lat:", lat, "Received lng:", lng);

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const response = await axios.get(`${weatherBaseURL}?lat=${lat}&lon=${lng}&appid=${weatherAPIKey}&units=metric`);
        console.log("API response data:", response.data);  

        const data = response.data;

        
        if (!data || !data.list) {
            return res.status(500).json({ error: 'Unexpected response from external API' });
        }

      
        res.json(data); 

    } catch (error) {
        console.error('Error fetching data from API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
