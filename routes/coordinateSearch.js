import axios from "axios";
import express from "express";

const router = express.Router();

const baseUrl = 'https://api.opencagedata.com/geocode/v1/json';
const API_KEY=  "22cd36b78dbc4bda868adeb7b10bb112";

router.get('/', async (req, res) => {
    const { location } = req.query;

    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }

    try {
        const response = await axios.get(`${baseUrl}?q=${encodeURIComponent(location)}&key=${API_KEY}`);
        const data = response.data;

        if (!data || !data.results || data.results.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }

        const { lat, lng } = data.results[0].geometry; // Extract lat/lng from the first result
        res.json({ lat, lng });
    } catch (error) {
        console.error('Error fetching coordinates from OpenCage:', error);
        res.status(500).json({ error: 'Failed to fetch coordinates' });
    }
});

export default router;
