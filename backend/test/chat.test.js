let socket
let fs = require('fs');
let flag = false;
let data = fs.readFileSync('./chat.test.json', 'utf-8');
data = JSON.parse(data);
var socketClient = {
    config: function (config) {
        let vm = this;
        socket = require('socket.io-client')(config.host, { "query": "token=" + config.token });
        console.log('this is wonderful world');
        // console.log('socket', socket);
        socket.on('connect', () => {
            socket.on("privateChat", (result) => {
                console.log("privateChat", result);
            })
            socket.on("message broadcast", (result) => {
                console.log("message broadcast", result);
            })

            socket.on("err", (result) => {
                console.log("err: ", result);
            })

            

            
            // this.privateChat(data.singleMessage);
            this.privateChat(data.groupMessage);
            
            socket.on('message broadcast', (data) => {
                console.log('data',data);
            });
            console.log('test connect scoket server!');
        });
    },

    /**
     * test private message
     */
    privateChat: (obj) => {
        socket.emit('privateChat', obj);
    },

    /**
      * test connectSingleClient
      */
    connectSingleClient: (obj) => {
        socket.emit('connectSingleClient', obj);
    },

    /**
    * test private message
    */
    connectMembers: (obj) => {
        socket.emit('connectMembers', obj);
    },

    getSocket: (obj) => {
        return socket
    },

    /**
      * test connectSingleClient
      */
    privateChatGroup: (obj) => {
        socket.emit('privateChatGroup', obj);
    }

}

module.exports = socketClient;
