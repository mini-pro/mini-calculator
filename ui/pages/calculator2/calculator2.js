const socketService = require('../../service/socket.service.js')
const util = require('../../utils/util.js')

Page({
  data: {
    caclu: '',
    tempCaclu: '',
    result: '',
    express: '',
    historyVisible: false,
    historys: wx.getStorageSync('cacluArr') || []
  },
  onLoad: function() {
    this.setData({

    })
    this.receiceResult();
    console.log(this.addComma(1234.234));
    console.log('-->', );

  },


  deaNum(str) {
    let result = str.match(/\d+/g);
    if (result){
      result.forEach((e) => {
        let num = this.addComma(e);
        console.log('nnum', num);
        str = str.replace(e, num);
      })
    }
    return str;
  },
  addComma(num) {
    let flag = 0;
    if (num < 0) {
      num = -num
      flag = 1;
    }
    num = num.toString();

    let result = num.toString();
    result = result.replace(/\.\d*$/, '');
    let len = result.length / 3;
    result = result.split('').reverse().join('');
    console.log('result', result);
    let j = 1;
    for (let i = 0; i < result.length; i++) {
      if ((i + 1) % 4 === 0) {
        var tmp = result.substring(0, i);
        var estr = result.substring(i, result.length);
        result = tmp + ',' + estr;
        i++;
      }
    }
    if (flag) {
      return '-' + num.replace(/^\d*/, result.split('').reverse().join(''));

    }
    return num.replace(/^\d*/, result.split('').reverse().join(''));
  },
  receiceResult() {
    const that = this;
    const socket = socketService.getSocket();
    socket.on('calculator', (data) => {
      let result = data.result;
      console.log('result;;;', result);
      if (result !== 0) {
        let data = {
          express: this.data.result + '=',
          caclu: result || '',
          result: this.addComma(result) || '',
          time: util.getTime("MM-dd hh:mm:ss", new Date())
        }
        this.setData(data);
        let cacluArr = wx.getStorageSync('cacluArr') || [];;
        cacluArr.unshift(data);
        wx.setStorageSync('cacluArr', cacluArr);
        this.historys = cacluArr;
        this.setData({
          historys: this.historys
        });
      } else {
        this.setData({
          express: this.data.result + '=',
          caclu: result,
          result: this.addComma(result)
        });
        let cacluArr = wx.getStorageSync('cacluArr') || [];;
        cacluArr.unshift({
          express: this.data.result + '=',
          caclu: result || '',
          result: this.addComma(result) || '',
          time: util.getTime("MM-dd hh:mm:ss", new Date())
        });
        wx.setStorageSync('cacluArr', cacluArr)
        this.historys = cacluArr;
      }
    })
  },


  dirtyClear(id) {
    if (/[\+\-\*\/]$/.test(id) && /[\+\-\*\/]$/.test(this.data.caclu)) {
      this.data.caclu = this.data.caclu.toString();
      this.data.caclu = this.data.caclu.substring(0, this.data.caclu.length - 1);
      return this.data.caclu;
    };
    return this.data.caclu;
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
      event.target.id = this.trans(this.data.caclu)
    }
    if (event.target.id === '%') {
      this.data.caclu = this.cacluPercent(this.data.caclu)
    }
    if (this.data.tempCaclu && event.target.id !== '(-') {
      this.setData({
        tempCaclu: ''
      });
    }
    if (event.target.id === '(-') {
      if (!this.data.tempCaclu) {
        this.data.tempCaclu = this.data.caclu
        if (!this.data.caclu) {
          this.data.caclu = event.target.id;
        } else if (/\d$/.test(this.data.caclu)) {
          let num = this.data.caclu.match(/\d*\.?\d*$/)[0];
          this.data.caclu = this.data.caclu.replace(/\d*\.?\d*$/, '');
          this.data.caclu += event.target.id + num;
        } else {
          this.data.caclu += event.target.id;
        }
      } else {
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
    // let matchs = this.data.result.match(/\d+$/);
    this.data.result = this.deaNum(this.data.result)
    // if (matchs) {
    //   console.log(1)
    //   let dealData = this.addComma(matchs[0]);
    //   this.data.result += dealData;
    //   console.log(2)
    //   console.log(3, dealData);
    // }


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
  clearCache() {
    this.setData({
      historys: ''
    });
    this.history()
    wx.removeStorageSync('cacluArr');
  },
  history() {
    let historyVisible = !this.data.historyVisible
    this.setData({
      historyVisible: historyVisible
    })
  },
  choiceHistory(event) {
    this.setData(event.currentTarget.dataset.hi)
    console.log('event', event)
  }
})