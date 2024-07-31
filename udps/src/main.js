import geckos, { iceServers } from "@geckos.io/server";
import http from "http";

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("My first server!");
};

const server = http.createServer(requestListener);
const io = geckos({
  bindAddress: "fly-global-services",
  cors: {
    allowAuthorization: true,
  },
  iceServers,
});

io.addServer(server);
io.onConnection((channel) => {
  channel.onDisconnect(() => {
    console.log(`${channel.id} got disconnected`);
  });

  channel.on("chat message", (data) => {
    console.log(`got ${data} from "chat message"`);
    // emit the "chat message" data to all channels in the same room
    io.room(channel.roomId).emit("chat message", data);
  });
}); // make sure the client uses the same port
// @geckos.io/client uses the port 9208 by default
server.listen(9208, () => {
  console.log(`Server is running on http://`);
});
