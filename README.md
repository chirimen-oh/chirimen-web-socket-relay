# chirimen-web-socket-relay

Tiny WebSocket relay service.

Connecting with `wss://host.name/any/path` will broadcast JSON data between clients with the same `/any/path` name.
In other words, you can treat /any/path as a webSocket broadcast channel.
