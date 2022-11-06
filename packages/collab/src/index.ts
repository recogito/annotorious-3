import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const doc = new Y.Doc();

const provider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', doc);

provider.on('status', (event: { status: 'disconnected' | 'connecting' | 'connected' }) => {
  console.log(event.status);
});