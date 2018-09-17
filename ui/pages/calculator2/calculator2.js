import rpn from '../../utils/rpn.js';
const socketService = require('../../service/socket.service.js')

Page({
  data: {
    caclu: '',
    tempCaclu: '',
    result: ''
  },
  onLoad: function() {
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
     
      if (result !== 0) {
        this.setData({
       
          caclu: result || '',
          result: result || ''
        });
      } else {
        this.setData({
        
          caclu: result,
          result: result
        });
      }
    })
  },

  dirtyClear(id){
    if (/[\+\-\*\/]$/.test(id) && /[\+\-\*\/]$/.test(this.data.caclu) ){
      this.data.caclu = this.data.caclu.toString();
      this.data.caclu = this.data.caclu.substring(0, this.data.caclu.length - 1);
     return this.data.caclu; 
    };
    return this.data.caclu ;
  },

  trans(express) {
    let x = express.match(/\(/g)
    let y = express.match(/\)/g)
    if (!x && !y) return '('
    if (x && !y) return ')'
    if (x.length == y.length) {
      return '('
    }
    return ')'
  },
  cacluPercent(caclu) {
    if (caclu) caclu = caclu.toString();
    let arr = caclu.match(/\d*\.?\d*$/);
    caclu = caclu.replace(/\d*\.?\d*$/, '');
    caclu = caclu.replace(/\d*\.?\d*$/, '');
    if (arr) {
      caclu += arr[0] / 100;
    }
    return caclu;
  },
  express(event) {
    this.data.caclu = this.dirtyClear(event.target.id) || '';
    this.data.caclu = this.data.caclu.toString();
   
      if (event.target.id === '(') {
        event.target.id  = this.trans(this.data.caclu)
    }
    if (event.target.id === '%') {
      this.data.caclu = this.cacluPercent(this.data.caclu)
    }
    if (this.data.tempCaclu){
      this.setData({
        tempCaclu:''
      });
    }
     if (event.target.id === '(-') {
       if (!this.data.tempCaclu){
         this.data.tempCaclu =this.data.caclu 
         if (!this.data.caclu) { this.data.caclu = event.target.id;} 
         else if (/\d$/.test(this.data.caclu)) {
           let num = this.data.caclu.match(/\d*\.?\d*$/)[0];
           this.data.caclu = this.data.caclu.replace(/\d*\.?\d*$/, '');
           this.data.caclu += event.target.id + num;
         } else {
           this.data.caclu += event.target.id;
         }
       }else{
         this.data.caclu = this.data.tempCaclu;
         this.data.tempCaclu = '';
         this.setData({
           tempCaclu: this.data.tempCaclu,
           caclu: this.data.caclu
         });
       }
     
    }
    if (/^[\d|\+\-\*/\.\(\)]$/.test(event.target.id)) {
      this.data.caclu += event.target.id;
    }
    this.data.result = this.data.caclu.replace(/\*/g, 'x');
    this.data.result = this.data.result.replace(/\//g, '÷');
   
    
    this.setData({
      caclu: this.data.caclu,
      result: this.data.result
    });
  },
  backspace() {
    if (this.data.result) {
      this.data.result = this.data.result.toString();
      this.data.caclu = this.data.caclu.toString();
      this.data.result = this.data.result.substring(0, this.data.result.length - 1);
      this.data.caclu = this.data.caclu.substring(0, this.data.caclu.length - 1);
    }
    this.setData({
      result: this.data.result,
      caclu: this.data.caclu
    })

  },
  caclu() {
    let cacluArr = wx.getStorageSync('cacluArr') || [];;
    cacluArr.push({
      caclu: this.data.caclu,
      result: this.data.result
    });
    wx.setStorageSync('cacluArr', cacluArr);
    console.log('this.data.caclu', this.data.caclu);
    socketService.calculator(this.data.caclu);
  },
  clear() {
    this.setData({
    
      caclu: '',
      result: ''
    });
  },
})