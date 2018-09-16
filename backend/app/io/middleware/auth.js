'use strict';
let url = require('url');
module.exports = app => {
  return async (ctx, next) => {
    try {
      let query = url.parse(ctx.socket.request.url, true).query || "";
      let token = query.token;
      return await next()
    } catch (error) {
      console.error("auth Error", error);
      ctx.socket.emit('err', { code: "999", msg: error });
    }
  };
};
