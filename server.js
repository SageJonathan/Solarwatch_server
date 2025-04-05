import "dotenv/config";
import express from "express";
import cors from "cors";
import solarRouter from "./api/routes/solarSearch.js";
import coordinateRouter from "./api/routes/coordinateSearch.js";
import weatherSearch from "./api/routes/weatherSearch.js";
import forecastSearch from "./api/routes/forecastSearch.js";

// Methods
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// Routes
app.use("/solarSearch", solarRouter);
app.use("/coordinateSearch", coordinateRouter);
app.use("/weatherSearch", weatherSearch);
app.use("/forecastSearch", forecastSearch);

// Default 
app.get("/", (_req, res) => {
  res.send(
    `Welcome to the Solar Watch API. Available routes: 
    - /solarSearch: Get solar-related data
    - /coordinateSearch: Process location-based coordinates
    - /weatherSearch: Get current weather data
    - /forecastSearch: Get a 4-day weather forecast
    __Consider donating to suport the service!__`
    
  );
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

export default app;