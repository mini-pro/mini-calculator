
let User = require('../../service/user');


module.exports = app => {
    class Api extends app.Controller {
        async getDataFromRedis() {
            const ctx = this.ctx;
            let key = ctx.request.query.key;
            const user = await this.ctx.service.lib.cache.get('user', key);
            ctx.body = user;
        }

        async getDataFromMongo() {
            const ctx = this.ctx;
            const user = await ctx.model.User.findOne({});
            ctx.body = user;
        }

    }
    return Api;
};









