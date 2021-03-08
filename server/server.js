const express = require('express')
const app = express();
const logsR = require('./routes/logs')
const usersR = require('./routes/users')
const bodyParser = require('body-parser');
const cors = require('cors')
const http = require('http').Server(app);
const io = require("socket.io")(http, {
    cors: {
      origin: "*",
      methods: ['GET, POST, OPTIONS, PUT, PATCH, DELETE']
    }
  });
  let onlineUsers = []

  app.use(cors({
    credentials: true,
    origin: '*'
  }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/logs', logsR);
app.use('/users', usersR);

const port=process.env.PORT || 8080
http.listen(port,() => {
  console.log(`Server running at port `+port);
  });
io.on('connection', function (socket) {
    let userObj = {}
    console.log("New socket "+ socket.id +" connected!")
  
    socket.on("WELCOME_USER",(_userdata)=>{
      console.log("welcome", _userdata.userName)
      socket.broadcast.emit("INTRODUCE_USER", _userdata)
      
    })

    socket.on("HELLO_USER", (_id,_contacts) => {
      if (!onlineUsers.some((obj) => obj.userId === _id)) {
        userObj = {
          userId: _id,
          socketId: socket.id
        }
        onlineUsers.push(userObj)
      }
      io.emit("WHO_IS_ONLINE", onlineUsers)
      console.log(onlineUsers.length+" are online now")
    });
  
    socket.on("GOODBYE_USER", (_id) => {
      console.log("Goodbye ", _id)
      onlineUsers = onlineUsers.filter(user => user.userId !== _id)
      console.log(onlineUsers)
      io.emit("WHO_IS_ONLINE", onlineUsers)
      console.log(onlineUsers.length+" are online now")
    })
  
    socket.on('disconnect', function () {
      console.log(socket.id + ' disconnected!');
      onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
      io.emit("WHO_IS_ONLINE", onlineUsers)
      console.log(onlineUsers.length+" are online now")
    })
    socket.on("SEND_MESSAGE", (_messagepacket) => {
  if (onlineUsers.find(user=>user.userId===_messagepacket.recipientId)){
    console.log(_messagepacket)
    io.to(onlineUsers.find(user=>user.userId===_messagepacket.recipientId).socketId).emit("RECEIVE_MESSAGE",_messagepacket)
    io.to(onlineUsers.find(user=>user.userId===_messagepacket.senderId).socketId).emit("RECEIVE_MESSAGE",_messagepacket)
  }else{
    io.to(onlineUsers.find(user=>user.userId===_messagepacket.senderId).socketId).emit("MISSED_MESSAGE",_messagepacket)
  }
    })
    socket.on('TYPING_ON', (_senderId, _recipientId)=>{
      io.to(onlineUsers.find(user=>user.userId===_recipientId).socketId).emit("TYPING_ON",_senderId)

    })
    socket.on('TYPING_OFF', (_senderId, _recipientId)=>{
      io.to(onlineUsers.find(user=>user.userId===_recipientId).socketId).emit("TYPING_OFF",_senderId)

    })
  });