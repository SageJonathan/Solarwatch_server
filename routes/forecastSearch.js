import axios from "axios";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const weatherBaseURL = process.env.WEATHER_BASE_FORECAST_URL;
const weatherAPIKey = process.env.WEATHER_API_KEY;

router.get("/", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  try {
    const response = await axios.get(
      `${weatherBaseURL}?lat=${lat}&lon=${lng}&appid=${weatherAPIKey}&units=metric`
    );

    const data = response.data;

    if (!data || !data.list) {
      return res
        .status(500)
        .json({ error: "Unexpected response from external API" });
    }
    const forecastData = data.list;
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1); 

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        let dayData = [];

        for (let i = 0; i <= 4; i++) {
            const targetDate = new Date(tomorrow);
            targetDate.setDate(tomorrow.getDate() + i); 
            
            const dayName = days[targetDate.getDay()];

            const dayForecast = forecastData.filter(forecast => {
                const forecastDate = new Date(forecast.dt * 1000); 
                return forecastDate.getDate() === targetDate.getDate();
            });

            const avgTemp = dayForecast.reduce((acc, forecast) => acc + forecast.main.temp, 0) / dayForecast.length;
            const avgHumidity = dayForecast.reduce((acc, forecast) => acc + forecast.main.humidity, 0) / dayForecast.length;
            const avgVisibility = dayForecast.reduce((acc, forecast) => acc + forecast.visibility, 0) / dayForecast.length;

            const weatherCondition = dayForecast[0].weather[0].main; 

            dayData.push({
                day: dayName,
                averageTemperature: avgTemp.toFixed(2), 
                weather: weatherCondition,
                averageVisibility: avgVisibility,
                averageHumidity: avgHumidity,
            });
        }

    res.json(dayData);
  } catch (error) {
    console.error(
      "Error fetching data from API:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
