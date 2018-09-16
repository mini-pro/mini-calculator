module.exports = app => {
  return class Cache extends app.Controller {
    /**
     * 
     * @param {the hash name} cacheName 
     * @param {the hash key} key 
     */
    async get(cacheName, key) {
      const { ctx, app } = this;
      let reply =  await app.redis.hget(cacheName, key)
      let str = decodeURIComponent(reply);
      return JSON.parse(str);
    }


    /**
     * 
     * @param {*} cacheName 
     * @param {*} key 
     * @param {*} value 
     */
    async put(cacheName, key, value) {
      const { app } = this;
      var str = JSON.stringify(value);
      str = encodeURIComponent(str);
      return await app.redis.hset(cacheName, key, str);
    }
  }
  return Cache;
};