import axios from "axios";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const solarBaseURL = process.env.SOLAR_BASE_URL; 

router.get('/', async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const response = await axios.get(`${solarBaseURL}?lat=${lat}&lng=${lng}`);
        const data = response.data;

        if (!data || !data.results) {
            return res.status(500).json({ error: 'Unexpected response from external API' });
        }

        const mountainInfo = {
            sunrise: data.results.sunrise,
            sunset: data.results.sunset,
            day_length: data.results.day_length,
            first_light:data.results.first_light,
            last_light:data.results.last_light,
            dawn:data.results.dawn,
            dusk:data.results.dusk,
            solar_noon:data.results.solar_noon,
            golden_hour: data.results.golden_hour,
        };

        res.json(mountainInfo);
    } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
