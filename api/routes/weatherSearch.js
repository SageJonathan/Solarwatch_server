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
            location: data.name || "Unknown location",
            temperature: isNaN(data.main.temp) ? 0 : data.main.temp.toFixed(0),
            feels_like: isNaN(data.main.feels_like) ? 0 : data.main.feels_like.toFixed(0),
            weather: data.weather?.[0]?.description || "Unknown",
            wind_speed: isNaN(data.wind.speed) ? 0 : data.wind.speed,
            humidity: isNaN(data.main.humidity) ? 0 : data.main.humidity,
            visibility: isNaN(data.visibility) ? 0 : data.visibility,
            pressure: isNaN(data.main.pressure) ? 0 : data.main.pressure,
            cloudiness: isNaN(data.clouds.all) ? 0 : data.clouds.all,
            rain: data.rain && data.rain["1h"] ? data.rain["1h"] : 0, 
          };
          

        res.json(currentWeather);
    } catch (error) {
        console.error('Error fetching data from API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
