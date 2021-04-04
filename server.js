const { Server } = require("net");

const PORT = 8000;
const HOST = "localhost";
const END = "END";

const connections = new Map();

const error = (message) => {
  console.error(message);
  process.exit(1);
};

const sentMessage = (message, origin) => {
  for (const socket of connections.keys()) {
    if (socket !== origin) {
      socket.write(message);
    }
  }
};

const listen = (host, port) => {
  const server = new Server();
  server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Connection from: ${remoteSocket}`);
    socket.setEncoding("utf8");
    socket.on("data", (message) => {
      if (message === END) socket.end();
      if (!connections.has(socket)) {
        connections.set(socket, message);
        console.log(`Set username: ${message} for ${remoteSocket}`);
      } else {
        const fullMessage = `[${connections.get(socket)}]: ${message}`;
        console.log(`${remoteSocket} -> ${fullMessage}`);
        sentMessage(fullMessage, socket);
      }
    });
    socket.on("close", () => {
      console.log(
        `[${connections.get(socket)}] from: ${remoteSocket} was disconnected.`
      );
      connections.delete(socket);
    });
  });

  server.listen({ host, port }, () =>
    console.log(`Listening in ${host}:${port}`)
  );

  server.on("error", (err) => {
    error(err.message);
  });
};

const main = () => {
  if (process.argv.length !== 3) {
    error(`Usage: node ${__filename} port`);
  }
  let port = process.argv[2];
  if (isNaN(port)) {
    error(`Invalid port: ${port}`);
  }
  port = parseInt(port, 10);
  listen(HOST, port);
};

if (require.main === module) {
  main();
}
