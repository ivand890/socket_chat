const { Socket } = require("net");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const socket = new Socket();

const PORT = 8000;
const HOST = "localhost";
const END = "END";

socket.connect({ host: HOST, port: PORT });
socket.setEncoding("utf-8");
readline.on("line", (line) => {
  socket.write(line);
  if (line === END) {
    socket.end();
  }
});

socket.on("data", (data) => console.log(data));

socket.on("close", () => process.exit(0));