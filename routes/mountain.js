import axios from "axios";
import express from "express";
import fs from 'fs';
import { v4 } from "uuid";


const router = express.Router();

router.get("/", (_req, res) => {
  try {
    const mountainsBuffer = fs.readFileSync("./data/mountain.json", "utf-8");
    const mountains = JSON.parse(mountainsBuffer);

    const mountainInfo = mountains.map((mountain) => ({
      id: mountain.id,
      sunrise: mountain.results.sunrise,
      sunset: mountain.results.sunset,
      day_length:mountain.results.day_length,
      weather:mountain.results.weather
      
    }));

    res.json(mountainInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
  });

  router.get("/:mountainId", (req, res) => {
    try {
      const mountainsBuffer = fs.readFileSync("./data/mountain.json", "utf-8");
    const mountains = JSON.parse(mountainsBuffer);
  
      const mountainId = req.params.mountainId;
      const singleMountain = mountains.find((mountain) => mountain.id === mountainId);
  
      if (!singleMountain) {
        return res.status(404).json({ error: "Info not found" });
      }

      const mountainInfo = {
        sunrise: singleMountain.results.sunrise,
        sunset: singleMountain.results.sunset,
        day_length: singleMountain.results.day_length,
        weather:singleMountain.results.weather
      };
  
      res.json(mountainInfo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
export default router