# Realtime Server

[...TODO]

API sketch...


```js
// Gateway maintains a number of Rooms.

// Each Room is a shared YJS doc with a list of
// websocket connections.
const gateway = new Gateway(config);

// Whenever a client connects, the gateway adds
// the client to the room, or spawns a new new room.

// When the room spawns, the gateway fetches stored annotations from the DB.

// The gateway listens to events from rooms and updates
// the DB accordingly.

// Room API (sketched):
const room = new Room();

room.on('createAnnotation', a => {});
room.on('updateAnnotation', (a, previous) => {});
room.on('deleteAnnotation', a => {});
``` 