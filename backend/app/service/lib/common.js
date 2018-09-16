'use strict';

module.exports = app => {
    class Common extends app.Service {
        /**
         * the message chatNumber
         * @param {*} chatNumber 
         */
        async checkGroupType(chatNumber) {
            if (chatNumber.includes('ava_group')) {
                return '2';
            }
            return '1';
        };

        /**
         * 
         * @param {*} users 
         * @param {*} openid 
         */
        getSendUsers(users, openid) {
            let wxOpenid = 'wx-' + openid, webOpenid = 'web-' + openid;
            let messageUsers = []
            if (users[wxOpenid]) { messageUsers.push(users[wxOpenid]) };
            if (users[webOpenid]) { messageUsers.push(users[webOpenid]) };
            if (messageUsers[0]) {
                return messageUsers;
            }
            return '';
        };

        /**
         * @param {the send message} message 
         * @param {the receive user obj} users 
         * @param {the send message openid} fromOpenid 
         * @param {the receive message openid} toOpenid 
         */
        async sendMessage(message, users, fromOpenid, toOpenid) {
            let detail = {
                openid: toOpenid,
                msgUnRead: true
            }
            let notice, noticeFlag = true;
            if (users[0].openid !== fromOpenid) {
                notice = {
                    to: toOpenid,
                    role: message.toRole,
                    msg: message
                }
            }
            users.forEach((user) => {
                message.msgUnRead = true
                if (user.openid === fromOpenid) {
                    message.msgUnRead = false;
                    detail.msgUnRead = false;
                }
                if (user.socket.connected === true) {
                    noticeFlag = false;
                    if (user.socket.message && user.socket.message.chatNumber === message.chatNumber) {
                        message.msgUnRead = false;
                        detail.msgUnRead = false;
                    }
                }
                let tempMessage = JSON.parse(JSON.stringify(message));
                tempMessage.status.push({
                    openid: toOpenid,
                    msgUnRead: message.msgUnRead
                });
                user.socket.emit("privateChat", tempMessage);
            })
            message.status.push(detail);
            // users.forEach((user) => {
            //     user.socket.emit("privateChat", message);
            // });
            if (notice && noticeFlag) {
                this.ctx.service.rabbit.sendNotice(notice);
            }
        }


    }
    return Common;
};
