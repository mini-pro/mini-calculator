
let fs = require('fs');
let chat = require('./chat.test');
let data = fs.readFileSync('./chat.test.json', 'utf-8');
data = JSON.parse(data);
// console.log('data', data);
let config = {
    host: 'http://127.0.0.1:8090',
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxvYWQudGVzdEBwd2MuY29tIiwiX2lkIjoiNWFjZjEzN2Y1N2Y4MjdjYzk3MWUwZDI2IiwiZnJvbVNvdWNlIjoid3giLCJpYXQiOjE1MjM1MjAzODN9.RPv8wox2QLouJ_Wb8SguTQQTQ8xD8v9hzfHon-KZ1IE"
}
chat.config(config);

setTimeout(() => {
    /**
     * single message
     */
    let socket
    // chat.connectSingleClient({});
    // socket.on('connectSingleClient', () => {
    //     chat.privateChat(data.groupMessage);
    // })

    /**
     * group message
     */
    socket = chat.getSocket('12');
    socket.on('connect', () => {
        console.log('test... connect scoket server!');
    });
    socket.on('err', (message) => {
        console.log('err',message)
        // chat.privateChat(data.groupMessage);
    })
    setTimeout(()=> {
        // chat.privateChat(data.singleMessage);
        // socket.on('connect',() => {
        //     console.log('12345')
        //     chat.privateChat(data.singleMessage);
        // })
       
        
    },1000);
    // chat.connectMembers(data.groupObj);
    // socket.on('connectMembers', () => {
        // console.log('234534567');
        // chat.privateChat(data.singleMessage);
    // })
   

}, 3000)