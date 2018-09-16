'use strict';


module.exports = app => {
    let messageQ = 'message';
    let noticeQ = 'notice';
    class Rabbit extends app.Service {
        /**
         *  message send
         * @param {*} message 
         */
        async sendMessage(message) {
            if (message.context) {
                message.context = JSON.stringify(message.context);
                message.context = encodeURIComponent(message.context);
            }
            message.message = encodeURIComponent(message.message);
            message = JSON.stringify(message)
            app.sendCli.assertQueue(messageQ, { durable: true });
            app.sendCli.sendToQueue(messageQ, new Buffer(message), { persistent: true }); //make  sure the message persistent
        }
        /**
         *  notice send
         * @param {*} notice
         */
        async sendNotice(notice) {
            notice = JSON.stringify(notice)
            app.sendCli.assertQueue(noticeQ, { durable: true });
            app.sendCli.sendToQueue(noticeQ, new Buffer(notice));
        }
    }
    return Rabbit;
};

