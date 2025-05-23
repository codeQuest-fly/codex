import http from 'http';
import WebSocket from 'ws';

// Map to store active connections by task ID
const taskConnections = new Map<string, Set<WebSocket>>();

export function setupWebSocketServer(server: http.Server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    console.log('WebSocket connection established');

    // Extract task ID from URL query parameters
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const taskId = url.searchParams.get('taskId');

    if (taskId) {
      // Add connection to the task's connection set
      if (!taskConnections.has(taskId)) {
        taskConnections.set(taskId, new Set());
      }
      taskConnections.get(taskId)?.add(ws);

      console.log(`Client connected to task ${taskId}`);
    }

    // Handle client disconnection
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      if (taskId && taskConnections.has(taskId)) {
        taskConnections.get(taskId)?.delete(ws);
        // Clean up empty sets
        if (taskConnections.get(taskId)?.size === 0) {
          taskConnections.delete(taskId);
        }
      }
    });

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle different message types
        if (data.type === 'interaction_response' && taskId) {
          // Forward interaction response to the task handler
          // This would be implemented in the task service
          console.log(`Received interaction response for task ${taskId}:`, data.payload);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
  });

  return wss;
}

// Function to send updates to all clients subscribed to a task
export function sendTaskUpdate(taskId: string, data: any) {
  const connections = taskConnections.get(taskId);
  if (connections) {
    const message = JSON.stringify(data);
    connections.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}