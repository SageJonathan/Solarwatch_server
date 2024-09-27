import "dotenv/config";
import express from "express";
import cors from "cors";
import solarRouter from "./routes/solarSearch.js";
import coordinateRouter from "./routes/coordinateSearch.js";
import weatherSearch from "./routes/weatherSearch.js";

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
app.use("weatherSearch", weatherSearch);

// Default 
app.get("/", (_req, res) => {
  res.send(
    `Welcome to the home page. Please use "/mountain" to access the forecast`
  );
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
