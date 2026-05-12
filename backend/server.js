const express =
  require("express");

const http =
  require("http");

const cors =
  require("cors");

const dgram =
  require("dgram");

const { Server } =
  require("socket.io");

// EXPRESS APP
const app = express();

app.use(cors());

// HTTP SERVER
const server =
  http.createServer(app);

// SOCKET SERVER
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: [
      "GET",
      "POST",
    ],
  },
});

// TEST ROUTE
app.get("/", (req, res) => {

  res.send(
    "Simulink Backend Running"
  );

});

// SOCKET CONNECTION
io.on(
  "connection",
  (socket) => {

    console.log(
      "Frontend Connected:",
      socket.id
    );

    // CONNECTION STATUS
    socket.emit(
      "server-status",
      {
        status:
          "connected",
      }
    );

    socket.on(
      "disconnect",
      () => {

        console.log(
          "Frontend Disconnected"
        );

      }
    );
  }
);

// UDP SERVER
const udpServer =
  dgram.createSocket("udp4");

// THROTTLE CONTROL
let lastEmit = 0;

// UDP MESSAGE RECEIVE
udpServer.on(
  "message",
  (msg) => {

    try {

      // CLEAN UDP MESSAGE
      const cleanMsg =
        msg
          .toString()
          .replace(/\0/g, "")
          .trim();

      // PARSE JSON
      const data =
        JSON.parse(
          cleanMsg
        );

      console.log(
        "MATLAB DATA:",
        data
      );

      // THROTTLE FRONTEND UPDATES
      const now =
        Date.now();

      if (
        now - lastEmit >
        500
      ) {

        io.emit(
          "matlab-data",
          data
        );

        lastEmit = now;

      }

    } catch (err) {

      console.log(
        "UDP ERROR:"
      );

      console.log(err);

    }
  }
);

// UDP START
udpServer.bind(
  4000,
  () => {

    console.log(
      "UDP Server running on port 4000"
    );

  }
);

// SERVER START
server.listen(
  5000,
  () => {

    console.log(
      "Backend running on port 5000"
    );

  }
);