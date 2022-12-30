import { WebsocketProvider } from 'y-websocket';
import { Store } from '@annotorious/annotorious';

export const WebSocketClient = (room: string) => {
  const provider = new WebsocketProvider('ws://192.168.0.81:1234', room, Store.doc);

  provider.on('status', (event: { status: 'disconnected' | 'connecting' | 'connected' }) => {
    console.log(event.status);
  });
};
