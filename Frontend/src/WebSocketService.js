import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://13.202.101.254:8080/ws'),
      debug: (str) => { console.log(new Date(), str); },
    });
  }

  connect(onMessageReceived,teltonikaError) {
    this.client.onConnect = () => {
      console.log('WebSocket connection established');
      this.client.subscribe('/topic/data', (message) => {
        const data = JSON.parse(message.body);
        onMessageReceived(data);
      });
      this.client.subscribe('/topic/teltonikaError',(status)=>{
        const data = JSON.parse(status.body);   
        teltonikaError(data);   
      })
    };

    this.client.onDisconnect = () => {
      console.log('WebSocket connection closed');
    };

    this.client.activate();
  }
  
}



const webSocketService = new WebSocketService();
export default webSocketService;
