// WebSocket service for real-time updates

class WebSocketService {
  private socket: WebSocket | null = null;
  private taskId: string | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  
  // Connect to WebSocket server for a specific task
  connect(taskId: string) {
    if (this.socket && this.taskId === taskId) {
      return; // Already connected to this task
    }
    
    // Close existing connection if any
    this.disconnect();
    
    this.taskId = taskId;
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';
    this.socket = new WebSocket(`${wsUrl}?taskId=${taskId}`);
    
    this.socket.onopen = () => {
      console.log(`WebSocket connected for task ${taskId}`);
      this.reconnectAttempts = 0;
    };
    
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type) {
          const handler = this.messageHandlers.get(data.type);
          if (handler) {
            handler(data);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    this.socket.onclose = (event) => {
      console.log(`WebSocket disconnected for task ${taskId}`, event);
      
      // Attempt to reconnect if not closed intentionally
      if (this.taskId) {
        this.attemptReconnect();
      }
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  // Disconnect from WebSocket server
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.taskId = null;
    this.reconnectAttempts = 0;
  }
  
  // Register a handler for a specific message type
  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
    return () => this.messageHandlers.delete(type);
  }
  
  // Send a message to the server
  sendMessage(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }
  
  // Attempt to reconnect with exponential backoff
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`Attempting to reconnect in ${delay}ms...`);
    
    this.reconnectTimeout = setTimeout(() => {
      if (this.taskId) {
        this.reconnectAttempts++;
        this.connect(this.taskId);
      }
    }, delay);
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;