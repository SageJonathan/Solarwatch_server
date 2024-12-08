import axios from "axios";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const weatherBaseURL = process.env.WEATHER_BASE_URL;
const weatherAPIKey = process.env.WEATHER_API_KEY;

const getDateString = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


router.get("/weather", async (req, res) => {
    const { lat, lon } = req.query;


    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const response = await axios.get(`${weatherBaseURL}?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}&units=metric`);
        const data = response.data;

        if (!data || !data.list) {
            return res.status(500).json({ error: 'Unexpected response from external API' });
        }

        const today = new Date();
        const todayDateString = getDateString(today.getTime() / 1000);

        const forecastDays = [];
        let dayCounter = 0;

        for (let i = 0; i < data.list.length; i++) {
            const forecast = data.list[i];
            const forecastDateString = getDateString(forecast.dt);

            if (forecastDateString === todayDateString) {
                continue;
            }

            if (forecastDateString !== todayDateString && dayCounter < 4) {
                if (!forecastDays[dayCounter]) {
                    forecastDays[dayCounter] = {
                        date: forecastDateString,
                        temperature: forecast.main.temp,
                        feels_like: forecast.main.feels_like,
                        temp_min: forecast.main.temp_min,
                        temp_max: forecast.main.temp_max,
                        humidity: forecast.main.humidity,
                        weather: forecast.weather[0].description,
                        cloudiness: forecast.clouds.all,
                        visibility: forecast.visibility,
                        wind: {
                            speed: forecast.wind.speed,
                            deg: forecast.wind.deg,
                            gust: forecast.wind.gust,
                        },
                        rain: forecast.rain ? forecast.rain['3h'] : null, 
                    };
                }
                dayCounter++;
            }
            if (dayCounter >= 4) break;
        }

        res.json({
            cod: data.cod,
            message: data.message,
            cnt: forecastDays.length,
            list: forecastDays,
            city: {
                id: data.city.id,
                name: data.city.name,
                coord: data.city.coord,
                country: data.city.country,
                population: data.city.population,
                timezone: data.city.timezone,
                sunrise: data.city.sunrise,
                sunset: data.city.sunset,
            },
        });
    } catch (error) {
        console.error('Error fetching data from API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
