import express from "express";
import http from 'http';
import matchRouter from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";

const parsedPort = process.env.PORT ? Number(process.env.PORT) : 8000;
if(!Number.isInteger(parsedPort) || parsedPort < 0 || parsedPort > 65535) {
  throw new Error(`Invalid PORT: ${process.env.PORT}`);
}
const PORT = parsedPort;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
const server = http.createServer(app);

// JSON middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

app.use('/matches', matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  console.log(`Server is running on ${baseUrl}`);
  console.log(`Websocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`);
});