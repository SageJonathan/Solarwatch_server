// import axios from "axios";
// import express from "express";
// import dotenv from "dotenv";


// dotenv.config();

// const router = express.Router();

// const weatherBaseURL = process.env.WEATHER_BASE_URL; 
// const weatherAPI= process.env.WEATHER_API_KEY;

// router.get('/', async (req, res) => {
//     const { lat, lng } = req.query;

//     if (!lat || !lng) {
//         return res.status(400).json({ error: 'Latitude and longitude are required' });
//     }

//     try {
//         const response = await axios.get(`${weatherBaseURL}lat=${lat}&lon=${lng}&appid=${weatherAPI}`);
//         const data = response.list;

//         if (!data || !data.list) {
//             return res.status(500).json({ error: 'Unexpected response from external API' });
//         }

//         const weatherForecast = data.list.map((forecast) => ({
//             dt_txt: forecast.dt_txt,
//             temperature: forecast.main.temp,
//             weather: forecast.weather[0].description,
//             wind_speed: forecast.wind.speed,
//             humidity: forecast.main.humidity,
//         }));

//         res.json(weatherForecast);
//     } catch (error) {
//         console.error('Error fetching data from API:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// export default router;

import axios from "axios";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const weatherBaseURL = process.env.WEATHER_BASE_URL; 
const weatherAPI = process.env.WEATHER_API_KEY;

router.get('/', async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const response = await axios.get(`${weatherBaseURL}?lat=${lat}&lon=${lng}&appid=${weatherAPI}`);
        const data = response.data; 

        if (!data || !data.list) {
            return res.status(500).json({ error: 'Unexpected response from external API' });
        }

        const weatherForecast = data.list.map((forecast) => ({
            dt_txt: forecast.dt_txt,
            temperature: forecast.main.temp,
            weather: forecast.weather[0].description,
            wind_speed: forecast.wind.speed,
            humidity: forecast.main.humidity,
        }));

        res.json(weatherForecast);
    } catch (error) {
        console.error('Error fetching data from API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
