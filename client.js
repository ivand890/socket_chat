const { Socket } = require("net");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

//const PORT = 3000;
//const HOST = "localhost";
const END = "END";

const connect = (host, port) => {
  const socket = new Socket();
  socket.connect({ host, port });
  console.log(`Connecting to -> ${host}:${port}`);
  socket.setEncoding("utf-8");

  socket.on("connect", () => {
    console.log("Connected.");
    readline.question("Select your user name: ", (username) => {
      socket.write(username);
      console.log(
        `Type any message and press enter to send it. Type ${END} to exit.`
      );
    });
    readline.on("line", (line) => {
      socket.write(line);
      if (line === END) {
        socket.end();
      }
    });
    socket.on("data", (data) => console.log(data));
  });

  socket.on("close", () => process.exit(0));
  socket.on("error", (err) => {
    error(err.message);
  });
};

const error = (message) => {
  console.error(message);
  process.exit(1);
};

const main = () => {
  if (process.argv.length !== 4) {
    error(`Usage: node ${__filename} host port`);
  }
  const host = process.argv[2];
  let port = process.argv[3];
  if (isNaN(port)) {
    error(`Invalid port: ${port}`);
  }
  port = parseInt(port, 10);
  connect(host, port);
};

if (require.main === module) {
  main();
}
