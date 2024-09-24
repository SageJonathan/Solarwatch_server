import axios from "axios";
import express from "express";

const router = express.Router();

const baseUrl = 'https://api.sunrisesunset.io/json';

router.get('/', async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const response = await axios.get(`${baseUrl}?lat=${lat}&lng=${lng}`);
        const data = response.data;

        if (!data || !data.results) {
            return res.status(500).json({ error: 'Unexpected response from external API' });
        }

        const mountainInfo = {
            sunrise: data.results.sunrise,
            sunset: data.results.sunset,
            day_length: data.results.day_length,
        };

        res.json(mountainInfo);
    } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
