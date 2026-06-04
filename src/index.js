import express from "express";
import matchRouter from "./routes/matches.js";

const app = express();

// JSON middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

app.use('/matches', matchRouter);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});