import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import WebSocket from 'ws';
import { setupWebSocketServer } from './utils/websocket';
import fileRoutes from './routes/files';
import taskRoutes from './routes/tasks';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/tasks', taskRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket server
setupWebSocketServer(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;