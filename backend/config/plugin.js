'use strict';

// had enabled by egg
// exports.static = true;
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
  enable: true,
  package: 'egg-redis',
};
exports.mongoose = {
  enable: false,
  package: 'egg-mongoose',
};