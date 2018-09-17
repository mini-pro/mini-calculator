'use strict';

module.exports = appInfo => {
  name: "ava";
  const config = exports = {};
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.nj': 'nunjucks',
    },
  };
  config.logger = {
    encoding: 'gbk',
  };
  config.logger = {
    level: 'DEBUG',
  };
  
  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: '',
      db: 0,
    },
  };
  config.io = {
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: ['filter'],
      },
    }
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1512664448758_7448';
  config.ava_token = 'ava_token_12345';
  config.ava_dashboard_token = "ava_dashboard_12345";
  config.tokenKey = "@McQfTjWnZr4t7w!z%C*F-JaNdRgUkXp";
  config.url = {
    // api: 'http://localhost:8888',
    api: 'http://localhost:9001',
    rabbitApi: 'localhost'
  }

  config.mongoose = {

    url: 'mongodb://119.23.31.29/ava',
    // url: 'mongodb://23.99.112.102/ava',
    options: {
      "pass": "1qaz2wsx",
      "user": "ava",
      "poolSize": 100 
    },
  };
  // add your config here
  config.middleware = [];

  return config;
};


// 
