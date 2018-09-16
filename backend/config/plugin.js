'use strict';

exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};

exports.io = {
  enable: true,
  package: 'egg-socket.io',
};
exports.redis = {
  enable: false,
  package: 'egg-redis',
};
exports.mongoose = {
  enable: false,
  package: 'egg-mongoose',
};
