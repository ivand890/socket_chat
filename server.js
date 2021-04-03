const { Server } = require("net");


const PORT = 8000;
const HOST = "localhost";
const END = "END";

const error = (message) => {
  console.error(message);
  process.exit(1);
}

const listen = (host, port) => {
  const server = new Server();
  server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Connection from: ${remoteSocket}`);
    socket.setEncoding("utf8");
    socket.on("data", (message) => {
      if (message === END) {
        socket.end();
      } else {
        console.log(`${remoteSocket} -> ${message}`);
      }
    });
    socket.on("close", () =>
      console.log(`Cliente from: ${remoteSocket} was disconnected`)
    );
  });

  server.listen({ host, port }, () =>
    console.log(`Listening in ${host}:${port}`)
  );

  server.on("error", (err) => {
    error(err.message);
  })
}

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
}

if (require.main === module) {
  main();
}