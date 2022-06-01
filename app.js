const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

const db = require('./config/keys').mongoURI;
const users = require("./routes/api/users");
const rooms = require("./routes/api/rooms");
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const games = require("./routes/api/games");
const friends = require("./routes/api/friends")
const frequency = require("./routes/api/frequency");
const proxySetup = require('./config/setupProxyFile');

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  
app.use("/api/users", users);
app.use("/api/rooms", rooms);
app.use("/api/games", games);
app.use("/api/friends", friends);
app.use("/api/frequency", frequency);
app.use(passport.initialize());
require('./config/passport')(passport);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}
// Might need this if things error out. Keep this here just in case
// Actually this is freaking out. Need to fix
// proxySetup(app)
const server = app.listen(port, () => console.log(`Server is running on port ${port}`));
const io = require('socket.io')(server, { cors: { origin: "*"}});
app.set("io", io);

io.on("connection", socket => {
  socket.emit('message', "Connected to Backend");
  socket.broadcast.emit('message', "User has connected");

  socket.on("join_room", (data)=>{
    socket.join(data);
  });

  socket.on("leave_room", (data)=>{
    try{
      socket.leave(data);
    } catch (e){
      console.log(e)
    }
  });

  socket.on("join_lobby", ()=>{
    socket.join("lobby");
  });

  socket.on("leave_lobby", ()=>{
    try{
      socket.leave("lobby");
    } catch (e){
      console.log(e)
    }
  });

  socket.on('send_message', (data) => {
    // socket.broadcast.emit("receive_message", data);
    io.in(data.roomCode).emit("receive_message", data);
  });

  socket.on('update_guess', (data) => {
    // socket.broadcast.emit("receive_message", data);
    io.in(data.roomCode).emit("guess_updated", data);
  });
  socket.on('updateSelection', (data) => {
    // socket.broadcast.emit("receive_message", data);
    io.in(data.roomCode).emit("selection_updated", data);
  });
  socket.on("disconnect", (reason) => {
    io.emit("message", "user has left");
  });
});