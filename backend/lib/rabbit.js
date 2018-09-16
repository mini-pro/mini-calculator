
// let Rabbit = require('./lib/rabbit');


var open;
var messageQ = 'message';
let User = require('../app/service/user')
let quitGroupQ = 'quit-group';
module.exports = app => {
    open = require('amqplib').connect('amqp://' + app.config.url.rabbitApi);
    open.then(function (conn) {
        return conn.createChannel();
    }).then(function (ch) {
        app.sendCli = ch;
        return ch.assertQueue(quitGroupQ).then(function (ok) {
            return app.sendCli.consume(quitGroupQ, function (msg) {
                if (msg !== null) {
                    let obj = JSON.parse(msg.content.toString());
                    ch.ack(msg);
                    console.log("obj", obj);
                    return;
                    let users = User.getUser();
                    obj.members.forEach((member) => {
                        let wxOpenid = 'wx-' + member.openid, webOpenid = 'web-' + member.openid;
                        let user = users[wxOpenid] || users[webOpenid];
                        if (user) {
                            user.socket.emit("privateChat", obj.message);
                        }
                    })
                }
            }, { noAck: false });//make sure acknowledgment
        })
    }).catch(console.warn);
}
