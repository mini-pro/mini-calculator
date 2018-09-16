'use strict';

module.exports = app => {
    class Cache extends app.Service {
        /**
         * the obj is message obj
         * @param {*} obj 
         */

        async getUser(key) {
            try {
                console.log('key', key);
                // key = encodeURIComponent(key);

                let tokenMessage = await this.ctx.service.lib.auth.verifyToken(key);
                console.log('tokenMessage', tokenMessage);
                let user, clients = [];
                // let user = await this.ctx.service.lib.cache.get('user', tokenMessage._id);
                if (!user) {
                    user = await this.ctx.model.User.findById(tokenMessage._id).lean();
                }
                console.log('user', user);
                if (user) {
                    let openids = user.clients.map(x => x.openid);
                    console.log('openids', openids);

                    let tempUsers = await this.ctx.model.User.find({ openid: { $in: openids }, active: 1 }).lean();
                    console.log('tempUsers', tempUsers);

                    if (tempUsers) {
                        user.clients.forEach(client => {
                            tempUsers.forEach((tempUser) => {
                                if (client.openid === tempUser.openid) {
                                    clients.push(client);
                                }
                            })
                        })
                    }
                    console.log('clients', clients);
                    user.clients = clients;
                }
                if (!user) {
                    user = await this.ctx.model.SysUser.findById(tokenMessage._id).lean();
                }

                user.fromSouce = tokenMessage.fromSouce;
                return user;
            } catch (err) {
                throw err
            }

        };


        /**
         * 
         * @param {*} groupNumber 
         * @param {*} token 
         */
        async getGroupInfo(groupNumber, openid) {
            if (!groupNumber) {
                throw 'the groupNumber is lost'
            }
            const result = await this.ctx.model.GroupChat.findOne({ groupNumber: groupNumber });
            let flag = true, members = [];
            result.members = result.members.filter((e) => {
                return e.deleteStatus === false;
            })
            let openidList = result.members.map(x => x.openid);
            let tempUsers = await this.ctx.model.User.find({ openid: { $in: openidList }, active: 1 });
            if (tempUsers) {
                result.members.forEach(client => {
                    tempUsers.forEach((tempUser) => {
                        if (client.openid === tempUser.openid) {
                            members.push(client);
                        }
                    })
                })
            }
            result.members = members;
            result.members.forEach((e) => {
                if (e.openid === openid) {
                    flag = false;
                }
            })
            if (flag) {
                return
            }
            // result.data.data.members.filter((e) => { return e.deleteStatus === false });
            return result;
        };

    }
    return Cache;
};

