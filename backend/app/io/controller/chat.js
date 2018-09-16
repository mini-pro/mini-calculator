
let User = require('../../service/user');


module.exports = app => {
  class Controller extends app.Controller {
    async index() {
      const message = this.ctx.args[0];
      const say = await this.ctx.service.user.say();
    };

    /**
     * private chat
     */
    async privateChat() {
      const obj = this.ctx.args[0];
      if (!this.ctx.socket.message) {
        await this.ctx.service.chat.connectMember();
      }
      console.log('this.ctx.socket.message', this.ctx.socket.message);
      let chatType = this.ctx.socket.message.chatType;
      if (chatType == '1') {
        this.ctx.service.chat.privateSingleChat(obj);
      } else if (chatType == '2') {
        this.ctx.service.chat.privateGroupChat(obj);
      }
      else {
        this.ctx.socket.emit('err', 'the chatType is lost');
      }
    }

    async miniMessage() {
      const obj = this.ctx.args[0];
      console.log('obj', obj);
      this.ctx.socket.broadcast.emit('mini message', obj);
      this.ctx.socket.emit('mini message', obj);
      const sockets = User.getMiniUsers();
      console.log('sockets',sockets.length);
      // for (let i = 0; i < sockets.length; i++) {
      //   let socket = sockets[i];
      //   if(socket.connected === true){
      //     console.log('sockets message',obj);
      //     socket.emit('mini message',obj);
      //   }
       
      // }
    }

    


    async calculator() {
      const obj = this.ctx.args[0];
      console.log('obj', obj);
      let result = eval(obj.equation);
      this.ctx.socket.emit('calculator', {result});
    }


    async privateSelfChat() {
      const obj = this.ctx.args[0];
      obj.createdAt = new Date();
      let cacheUser = this.ctx.socket.user;
      const users = User.getUser();
      obj.fromSouce = cacheUser.fromSouce;
      // Multi-terminal Synchronize message
      //generate chat Number
      if (!obj.toName) {
        obj.toName = cacheUser.nickname;
      }
      obj.chatNumber = obj.chatNumber || await this.ctx.service.chat.generateChatNumber(obj);

      let wxOpenid = 'wx-' + cacheUser.openid, webOpenid = 'web-' + cacheUser.openid;
      let wxUser = users[wxOpenid];
      let webUser = users[webOpenid];
      obj.status = [{
        openid: cacheUser.openid,
        msgUnRead: false
      }];
      if (wxUser) {
        wxUser.socket.emit("privateChat", obj);
      }
      if (webUser) {
        webUser.socket.emit("privateChat", obj);
      }
      this.ctx.socket.broadcast.emit('message broadcast', obj);
      this.ctx.service.rabbit.sendMessage(obj);
    }



    /**
     * connect members
     */
    async connectMembers() {

      const obj = this.ctx.args[0];
      let cacheUser = this.ctx.socket.user;
      let data = {
        chatNumber: obj.chatNumber,
        members: [{ openid: cacheUser.openid }]
      }
      this.ctx.service.chat.updateMsg(data, cacheUser.token);
      await this.ctx.service.chat.connectMember();
      let members = [];
      this.ctx.socket.message.members.forEach((e) => {
        members.push(e.openid);
      })
      data = {
        chatNumber: obj.chatNumber,
        members: members
      }
      await this.ctx.service.chat.updateMsg(data, cacheUser.token);
    }

    async  disconnectMember() {
      this.ctx.socket.message = '';
    }

    async getMemory() {
      const ctx = this.ctx;
      ctx.body = process.memoryUsage();
      ctx.body.rss = ctx.body.rss / 1024 / 1024
      ctx.body.heapTotal = ctx.body.heapTotal / 1024 / 1024
      ctx.body.heapUsed = ctx.body.rss / 1024 / 1024
    }

  }
  return Controller;
};

// or async functions
//
exports.errSave = async function () {
  const errMessage = this.args[0];
  console.log("message save fail", errMessage);
};


exports.successSave = async function () {
  const succssMessage = this.args[0];
  console.log("message save success");
};










