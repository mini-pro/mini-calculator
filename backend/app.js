
// let Rabbit = require('./lib/rabbit');

// global.USER = [];
var messageQ = 'message';
let User = require('./app/service/user')
let noticeMessageQ = 'notice-message';
let clearMembersQ = 'clear-members';
let systemMessageQ = 'system-event';
let rabbit
let flag = true;
module.exports = app => {
    setTimeout(() => {
        open = require('amqplib').connect('amqp://' + app.config.url.rabbitApi);
        open.then(function (conn) {
            return conn.createChannel();
        }).then(function (ch) {
            app.sendCli = ch;
            rabbit = ch;
            if (flag) {
                sendMessage(app);
                sendSysMessage(app);
                clearMembers();
            }
        }).catch(console.warn);
    }, 1)

}

function sendSysMessage(app) {
    flag = false;
    rabbit.assertQueue(systemMessageQ).then(function (ok) {
        rabbit.consume(systemMessageQ, function (msg) {
            try {
                if (msg !== null) {
                    let obj = JSON.parse(msg.content.toString());
                    console.log('system-event', obj);
                    rabbit.ack(msg);
                    if (obj.message && obj.message.context && typeof obj.message.context === "string") {
                        obj.message.context = JSON.parse(obj.message.context);
                    }
                    let users = User.getUser();
                    obj.members.forEach((member) => {
                        let wxOpenid = 'wx-' + member.openid, webOpenid = 'web-' + member.openid;
                        let messageUsers = []
                        if (users[wxOpenid]) { messageUsers.push(users[wxOpenid]) };
                        if (users[webOpenid]) { messageUsers.push(users[webOpenid]) };
                        if (messageUsers[0]) {
                            messageUsers.forEach((e) => {
                                console.log('send system-event message', obj)
                                e.socket.emit('system-event', obj.message);
                                e.socket.broadcast.emit('system-event', obj.message);
                            })
                        }
                    })
                }
            } catch (error) {
                rabbit.ack(msg);
                console.log('error', error);
            }

        }, { noAck: false });//make sure acknowledgment
    })
}
function sendMessage(app) {
    flag = false;
    rabbit.assertQueue(noticeMessageQ).then(function (ok) {
        rabbit.consume(noticeMessageQ, function (msg) {
            try {
                if (msg !== null) {
                    let obj = JSON.parse(msg.content.toString());
                    console.log('obj', obj);
                    rabbit.ack(msg);
                    if (obj.message && obj.message.context && typeof obj.message.context === "string") {
                        obj.message.context = JSON.parse(obj.message.context);
                    }
                    let users = User.getUser();
                    obj.members.forEach((member) => {
                        let wxOpenid = 'wx-' + member.openid, webOpenid = 'web-' + member.openid;
                        let messageUsers = []
                        if (users[wxOpenid]) { messageUsers.push(users[wxOpenid]) };
                        if (users[webOpenid]) { messageUsers.push(users[webOpenid]) };
                        if (messageUsers[0]) {
                            messageUsers.forEach((e) => {
                                if (obj.event) {
                                    console.log('send deactive message', obj)
                                    e.socket.emit(obj.event, obj.message);
                                } else {
                                    console.log('send privateChat message', obj)
                                    e.socket.emit("privateChat", obj.message);
                                }
                            })
                        }
                    })
                }
            } catch (error) {
                console.log('error', error);
            }

        }, { noAck: false });//make sure acknowledgment
    })
}

function clearMembers() {
    flag = false;
    rabbit.assertQueue(clearMembersQ).then(function (ok) {
        rabbit.consume(clearMembersQ, function (msg) {
            try {
                if (msg !== null) {
                    let obj = JSON.parse(msg.content.toString());
                    rabbit.ack(msg);
                    console.log('...clear members', obj);
                    let users = User.getUser();
                    obj.forEach((member) => {
                        let wxOpenid = 'wx-' + member.openid, webOpenid = 'web-' + member.openid;
                        let user = users[wxOpenid] || users[webOpenid];
                        if (user) {
                            user.socket.message = '';
                        }
                    })
                }
            } catch (error) {
                console.log('error', error);
                rabbit.ack(msg);
            }

        }, { noAck: false });//make sure acknowledgment
    })
}



