# chirimen-web-socket-relay

Tiny WebSocket relay service.

Connecting with `wss://host.name/any/path` will broadcast JSON data between clients with the same `/any/path` name.
In other words, you can treat /any/path as a webSocket broadcast channel.

## How to Use

WebSocket learning sandbox. This project can be used as a base to try custom modifications.

1. Install dependencies:

   `npm install express`

2. Start the relay server:

   `node app.js`

Then open your client page and connect to the same path channel to test broadcasting.

Thanks to [satakagi](https://github.com/satakagi).
