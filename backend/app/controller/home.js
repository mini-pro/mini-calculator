'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async render() {
    console.log('https test connect....')
    const ctx = this.ctx;
    ctx.body = 'Hello World';
  }

  async getDataFromRedis() {
    console.log('https test connect....')
    console.log('app.redis--.',app.redis);
    const ctx =  this.ctx.service.lib.cache.get('user');
    console.log(ctx.request.key); 
    ctx.body = 'Hello World';
  }
}

module.exports = HomeController;
