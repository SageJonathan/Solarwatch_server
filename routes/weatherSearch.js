import axios from "axios";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const weatherBaseURL = process.env.WEATHER_BASE_URL; 
const weatherAPIKey = process.env.WEATHER_API_KEY;

router.get('/', async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const response = await axios.get(`${weatherBaseURL}?lat=${lat}&lon=${lng}&appid=${weatherAPIKey}&units=metric`);
        const data = response.data;

        if (!data || !data.weather) {
            return res.status(500).json({ error: 'Unexpected response from external API' });
        }

        const currentWeather = {
            location: data.name || 'Unknown location',
            temperature: data.main.temp,
            feels_like: data.main.feels_like,
            weather: data.weather[0].description,
            wind_speed: data.wind.speed,
            humidity: data.main.humidity,
            visibility: data.visibility,
            pressure: data.main.pressure,
            cloudiness: data.clouds.all,
            rain: data.rain ? data.rain['1h'] : null, // Optional, as rain may not always be present
        };

        res.json(currentWeather);
    } catch (error) {
        console.error('Error fetching data from API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
