import rpn from '../../utils/rpn.js';
const socketService = require('../../service/socket.service.js')

Page({
  data: {
    express: '',
    caclu: '',
    result: ''
  },
  onLoad: function () {
    this.setData({

    })
    this.receiceResult();
  },
  receiceResult() {
    const that = this;
    const socket = socketService.getSocket();
    socket.on('calculator', (data) => {
      let result = data.result;
      console.log('message', result);
      let express = this.data.result + '=';
      if (result !== 0) {
        this.setData({
          express: express || '',
          caclu: result || '',
          result: result || ''
        });
      } else {
        this.setData({
          express: express,
          caclu: result,
          result: result
        });
      }
    })
  },
  trans(express){
    let x = express.match(/\(/g)
    
    let y = express.match(/\)/g)
   
    if(!x && !y) return '('
    if (x && !y) return ')'
    if (x.length == y.length ){
      return '('
    }
    return ')'
  },
  express(event) {
    if (event.target.id === '*') {
      this.data.result += 'x'
    } else if (event.target.id === '/') {
      this.data.result += '÷'
    }
    else if (event.target.id === '(') {
      event.target.id = this.trans(this.data.result);
      this.data.result += event.target.id
   
    }
    else if (event.target.id === '%') {
      console.log('this.data.result---', this.data.result);
      if (this.data.result) this.data.result = this.data.result.toString();
      if (this.data.caclu) this.data.caclu = this.data.result.toString();
      let arr = this.data.result.match(/\d*\.?\d*$/);
      this.data.result = this.data.result.replace(/\d*\.?\d*$/, '');
      this.data.caclu = this.data.caclu.replace(/\d*\.?\d*$/, '');
      if (arr) {
        this.data.result += arr[0] / 100;
        this.data.caclu += arr[0] / 100;
      }
    }
    else {
      this.data.result += event.target.id;
    }
    if (/^[\d|\+\-\*/\.\(\)]$/.test(event.target.id)) {
      this.data.caclu += event.target.id;
    }
    this.setData({
      caclu: this.data.caclu,
      result: this.data.result
    });
  },
  backspace(){
    if (this.data.result){
      this.data.result = this.data.result.substring(0,this.data.result.length-1);
      this.data.caclu = this.data.caclu.substring(0,this.data.caclu.length - 1);
    }
    this.setData({result: this.data.result, caclu: this.data.caclu})
    
  },
  caclu() {
    let cacluArr = wx.getStorageSync('cacluArr') || [];;
    cacluArr.push({ caclu: this.data.caclu, result: this.data.result });
    wx.setStorageSync('cacluArr', cacluArr);
    console.log('this.data.caclu', this.data.caclu);
    socketService.calculator(this.data.caclu);
    
  },
  clear() {
    this.setData({
      express: '',
      caclu: '',
      result: ''
    });
  },
})