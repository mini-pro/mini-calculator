'use strict';
if(!global.users || !global.users[0]){
  global.users = {};
}
let miniUsers = [];

let socket;

exports.getUser = () => {
  return global.users
}

exports.getMiniUsers = () => {
  return miniUsers
}
exports.getSocket = () => {
  return socket
}
exports.setSocket = (params) => {
  return socket = params
  
}