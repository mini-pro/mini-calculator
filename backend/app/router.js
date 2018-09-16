'use strict';
let User = require('./service/user');
let url = require('url');
let i = 0;
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.render);
  const miniNamespace = app.io.of('/admin');

  app.io.route('privateChat', app.io.controller.chat.privateChat);
  app.io.route('connectMembers', app.io.controller.chat.connectMembers);
  app.io.route('privateSelfChat', app.io.controller.chat.privateSelfChat);
  app.io.route('disconnectMember', app.io.controller.chat.disconnectMember);
  app.io.route('miniMessage', app.io.controller.chat.miniMessage);
  app.io.route('calculator', app.io.controller.chat.calculator);
  app.get('/getMemory', app.io.controller.chat.getMemory);
  app.get('/getDataFromRedis', app.io.controller.api.getDataFromRedis);
  app.get('/getDataFromMongo', app.io.controller.api.getDataFromMongo);
  // miniNamespace.route.get('/mini',() => {
  //   console.log('2345');
  // } )
  miniNamespace.on('connection', (socket) => {
    console.log('the namespace had connect');
  })
  // app.io.route('connectSingleClient', app.io.controller.chat.connectSingleClient);

  //callback event
  app.io.route('errSave', app.io.controller.chat.errSave);
  app.io.route('successSave', app.io.controller.chat.successSave);

  /**
   * connect event
   */
  app.io.on('connection', (socket) => {
   console.log('user connection')
  })
};
