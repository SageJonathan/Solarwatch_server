import "dotenv/config";
import express from "express";
import cors from "cors";
import searchRouter from "./routes/solarSearch.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.use("/solarsearch", searchRouter);

app.get("/", (_req, res) => {
  res.send(
    `Welcome to the home page. Please use "/mountain" to access the forecast`
  );
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
