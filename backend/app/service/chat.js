'use strict';
let User = require('./user');

module.exports = app => {
    class Chat extends app.Service {
        /**
         * the obj is message obj
         * @param {*} obj 
         */
        async checkGroupObj(obj, members) {
            let msg = '';
            if (!obj.chatNumber) {
                throw 'the chatNumber is lost';
            }
            if (!obj.chatType) {
                throw msg = 'the chatType is lost';
            }
            if (!obj.fromRole) {
                throw msg = 'the fromRole is lost';
            }
            if (!members) {
                throw 'the group members is lost';
            }
            obj.members = members;
        };

        /**
        * generate chat number
        * @param {*} obj
        */
        async generateChatNumber(obj) {
            let chatNumber = '';
            if (obj.from.includes('ava_group')) {
                chatNumber = obj.chatNumber;
                return chatNumber;
            }
            if (obj.to.includes('ava_group')) {
                chatNumber = obj.chatNumber;
                return chatNumber;
            }
            chatNumber = obj.from > obj.to ? obj.from + '-' + obj.to : obj.to + '-' + obj.from;
            return chatNumber
        };
        /**
         * format message obj
         * @param {*} obj 
         */
        async formatData(obj) {
            obj.message = encodeURIComponent(obj.message);
            obj.fromName = encodeURIComponent(obj.fromName);
            obj.toName = encodeURIComponent(obj.toName);
            obj.createdAt = new Date();
        }


        async updateMsg(data, token) {
            const result = await this.ctx.curl(this.app.config.url.api + "/api/updateMsg?token=" + token, {
                dataType: 'json',
                method: 'POST',
                data: data
            });
        }

        async connectMember() {
            const obj = this.ctx.args[0];
            let cacheUser = this.ctx.socket.user;
            if (!obj || !obj.chatNumber) {
                obj.chatNumber = await this.ctx.service.chat.generateChatNumber(obj);
            }
            const chatType = await this.ctx.service.lib.common.checkGroupType(obj.chatNumber);
            switch (chatType) {
                case '1':
                    let [one, two] = ['-' + cacheUser.openid, cacheUser.openid + '-'];
                    let openid = obj.chatNumber.replace(one, '');
                    openid = openid.replace(two, '');
                    let user = await this.ctx.service.cache.getUser(cacheUser.token, openid);
                    let client = user.clients.filter((e) => {
                        return e.deleteStatus === false && e.openid === openid;
                    })
                    if (!client || !client[0] ) {
                        this.ctx.socket.message = ""
                        throw new Error("you haven't send message");
                    }
                    this.ctx.socket.message = {
                        members: [ {openid},{ openid: cacheUser.openid }],
                        chatType: chatType,
                        chatNumber: obj.chatNumber,
                        role: client[0].role
                    }; break;
                case '2':
                    let groupInfo = await this.ctx.service.cache.getGroupInfo(obj.chatNumber, cacheUser.openid);
                    if (!groupInfo) {
                        this.ctx.socket.message = '';
                        throw "you can't send message because you had been delete from this group "
                    }
                    this.ctx.socket.message = {
                        members: groupInfo.members,
                        chatType: chatType,
                        chatNumber: obj.chatNumber
                    }; break;
            }
        }



        async privateSingleChat(obj) {
            console.log('abc')
            let notice;
            let cacheUser = this.ctx.socket.user;
            const users = User.getUser();
            obj.createdAt = new Date();
            obj.fromSouce = cacheUser.fromSouce;
            // obj.fromRole = cacheUser.role;
            obj.chatNumber = await this.ctx.service.chat.generateChatNumber(obj);
            // Multi-terminal Synchronize message
            //format data
            //generate chat Number
            obj.members =  this.ctx.socket.message.members
            obj.toRole = this.ctx.socket.message.role;
            if(!obj.members){
                obj.members = [{ openid: obj.to }, { openid: cacheUser.openid }];
            }
            obj.status = [];

            for (let i = 0; i < obj.members.length; i++) {
                let to = obj.members[i];
                let messageUsers = this.ctx.service.lib.common.getSendUsers(users, to.openid);
                if (messageUsers) {
                    this.ctx.service.lib.common.sendMessage(obj, messageUsers, cacheUser.openid, to.openid)
                } else {
                    notice = {
                        to: to.openid,
                        role: obj.toRole,
                        msg: obj
                    }
                    let detail = {
                        openid: to.openid,
                        msgUnRead: true
                    }
                    obj.status.push(detail);
                    console.log('=======transfer center msg ================', obj);
                    this.ctx.service.rabbit.sendNotice(notice);
                }
            }

            this.ctx.socket.broadcast.emit('message broadcast', obj);
            this.ctx.service.rabbit.sendMessage(obj);
        }



        async privateGroupChat(obj) {
            if (!this.ctx.socket.message) {
                throw 'the first you must build a connect'
            }
            // const checkResult = await this.ctx.service.chat.checkGroupObj();
            const users = User.getUser();
            let cacheUser = this.ctx.socket.user
            obj.createdAt = new Date();
            obj.fromSouce = cacheUser.fromSouce;
            obj.chatType = '2';
            await this.ctx.service.chat.checkGroupObj(obj, this.ctx.socket.message.members);
            obj.status = [];
            // obj.members = this.ctx.socket.message.members;
            let groupInfo = await this.ctx.service.cache.getGroupInfo(obj.chatNumber, cacheUser.openid);
            console.log('groupIfo', groupInfo);
            if (!groupInfo) {
                throw "you can't send message because you had been delete from this group "
            }
            obj.members = groupInfo.members;

            for (let i = 0; i < obj.members.length; i++) {
                let to = obj.members[i];
                let messageUsers = this.ctx.service.lib.common.getSendUsers(users, to.openid);
                if (messageUsers) {
                    console.log('messageUser', messageUsers);
                    this.ctx.service.lib.common.sendMessage(obj, messageUsers, cacheUser.openid, to.openid)
                } else {
                    let detail = {
                        openid: to.openid,
                        msgUnRead: true
                    }
                    obj.status.push(detail);
                }
            }
            this.ctx.socket.broadcast.emit('message broadcast', obj);
            this.ctx.service.rabbit.sendMessage(obj);
        }


        // async privateSingleChat(obj) {
        //     let notice;
        //     let noticeFlag;
        //     let cacheUser = this.ctx.socket.user;
        //     const users = User.getUser();
        //     let serverSocket = User.getSocket();
        //     obj.createdAt = new Date();
        //     obj.fromSouce = cacheUser.fromSouce;
        //     // obj.fromRole = cacheUser.role;
        //     obj.chatNumber = await this.ctx.service.chat.generateChatNumber(obj);
        //     // Multi-terminal Synchronize message
        //     //format data
        //     //generate chat Number
        //     // console.log('this.ctx.socket.members', this.ctx.socket.message.members);
        //     if (!this.ctx.socket.message) {
        //         obj.members = [{ openid: obj.to }, { openid: cacheUser.openid }];
        //     } else {
        //         obj.members = this.ctx.socket.message.members || [{ openid: obj.to }, { openid: cacheUser.openid }];
        //     };
        //     obj.status = [];
        //     // this.ctx.socket.emit('privateChat', obj);
        //     obj.members.forEach((to) => {
        //         let detail = {
        //             openid: to.openid,
        //             msgUnRead: true
        //         };
        //         if (to.openid !== cacheUser.openid) {
        //             notice = {
        //                 to: to.openid,
        //                 role: obj.toRole
        //             }
        //         }
        //         noticeFlag = true;





        //         users.forEach((e, index) => {
        //             if (e.openid === to.openid) {
        //                 if (e.socket.connected === true) {

        //                     if (e.openid !== cacheUser.openid) {
        //                         noticeFlag = false;
        //                         notice = {
        //                             to: to.openid,
        //                             role: obj.toRole
        //                         }
        //                     }
        //                     // noticeFlag = false;

        //                     if (e.socket.message && e.socket.message.members instanceof Array) {
        //                         e.socket.message.members.forEach((member) => {
        //                             if (member.openid === cacheUser.openid) {
        //                                 detail.msgUnRead = false;
        //                             }
        //                         })
        //                     }
        //                 }
        //             }
        //         });
        //         obj.status.push(detail);
        //     });
        //     obj.members.forEach((to) => {
        //         users.forEach((e, index) => {
        //             if (e.openid === to.openid) {
        //                 console.log("single message send", e.openid);
        //                 e.socket.emit("privateChat", obj);
        //             }
        //         })
        //     })
        //     if (noticeFlag) {
        //         this.ctx.service.rabbit.sendNotice(notice);
        //     }
        //     this.ctx.socket.broadcast.emit('message broadcast', obj);
        //     // if (serverSocket) {
        //     //     await this.ctx.service.chat.formatData(obj);
        //     //     serverSocket.emit("privateMessage", obj);
        //     // } else {
        //     this.ctx.service.rabbit.sendMessage(obj);
        //     // }

        // }

        // async privateGroupChat(obj) {
        //     if (!this.ctx.socket.message) {
        //         throw 'the first you must build a connect'
        //     }
        //     // const checkResult = await this.ctx.service.chat.checkGroupObj();
        //     const users = User.getUser();
        //     let serverSocket = User.getSocket();
        //     let cacheUser = this.ctx.socket.user
        //     obj.createdAt = new Date();
        //     obj.fromSouce = cacheUser.fromSouce;
        //     obj.chatType = '2';
        //     await this.ctx.service.chat.checkGroupObj(obj, this.ctx.socket.message.members);
        //     obj.status = [];
        //     obj.members = this.ctx.socket.message.members;


        //     obj.members.forEach((to) => {
        //         let detail = {
        //             openid: to.openid,
        //             msgUnRead: true
        //         }
        //         users.forEach((e, index) => {
        //             if (e.openid === to.openid) {
        //                 if (e.socket.connected === true) {
        //                     if (e.socket.message && e.socket.message.members instanceof Array) {
        //                         e.socket.message.members.forEach((member) => {
        //                             if (member.openid === cacheUser.openid) {
        //                                 detail.msgUnRead = false;
        //                             }
        //                         })
        //                     }
        //                 }

        //             }
        //         })
        //         obj.status.push(detail);
        //     })
        //     obj.members.forEach((to, index) => {
        //         users.forEach((e) => {
        //             if (e.openid === to.openid) {
        //                 console.log('the group ' + obj.chatNumber + ' message had been send to  ' + index + 'people')
        //                 e.socket.emit("privateChat", obj);
        //             }
        //         })
        //     })
        //     this.ctx.socket.broadcast.emit('message broadcast', obj);
        //     this.ctx.service.rabbit.sendMessage(obj);
        //     // if (serverSocket) {
        //     //     await this.ctx.service.chat.formatData(obj);
        //     //     serverSocket.emit("privateMessage", obj);
        //     // }
        // }
    }
    return Chat;
};

