let socket
const host = require('../config').socket
const io = require('../utils/weapp.socket.io.js');

socket = io(host, {
  path:"/miniSocket",
  query: {
    fromSource: "mini"
  }
})
socket.on('connect', function () {
  console.log('connect....')
});

exports.sendMessage = (msg) => {
  console.log('send message', msg);
  if (msg.content.trim() !== '') {
    socket.emit('miniMessage', msg);
  }
}

exports.calculator = (msg) => {
  console.log('calculator', msg);
  socket.emit('calculator', { equation:msg});
}

exports.getSocket = () => {
  return socket
}