import WebSocket from 'ws';
import http from 'http';
import sqliteStorage from './sqliteStorage';
import { setupWSConnection } from './setupWSConnection';

const wss = new WebSocket.Server({ noServer: true });

const host: string = process.env.HOST || '192.168.0.81';
const port: number = (process.env.PORT && parseInt(process.env.PORT)) || 1234;

wss.on('connection', setupWSConnection(sqliteStorage));

const server = http.createServer((_, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('okay');
});

server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here
  // See https://github.com/websockets/ws#client-authentication
  const handleAuth = ws => {
    wss.emit('connection', ws, request)
  }

  wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen(port, host, null, () => {
  console.log(`running at '${host}' on port ${port}`)
});
