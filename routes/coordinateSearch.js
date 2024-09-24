import axios from "axios";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const opencageBaseUrl = process.env.OPENCAGE_BASE_URL;
const opencageAPIKey = process.env.OPENCAGE_API_KEY;

router.get('/', async (req, res) => {
    const { location } = req.query;

    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }

    try {
        const response = await axios.get(`${opencageBaseUrl}?q=${encodeURIComponent(location)}&key=${opencageAPIKey}`);
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
