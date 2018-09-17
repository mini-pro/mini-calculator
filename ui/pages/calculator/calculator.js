import rpn from '../../utils/rpn.js';

Page({
  data: {
    express: '',
    caclu: '',
    result: ''
  },
  onLoad: function() {
    this.setData({

    })
  },
  express(event) {
    if (event.target.id === '*') {
      this.data.result += 'x'
    } else if (event.target.id === '/') {
      this.data.result += '÷'
    } else if (event.target.id === '(-'){
      console.log('1212')
      if (!this.data.result) this.data.result = event.target.id;
      else if (/\d$/.test(this.data.result)){
        let num = this.data.result.match(/\d*$/)[0];
        this.data.result = this.data.result.replace(/\d*$/,'');
        this.data.result += event.target.id + num;
      }else{
        this.data.result += event.target.id;
      }
    }
    else if (event.target.id === '%') {
      console.log('this.data.result---', this.data.result);
      if (this.data.result) this.data.result = this.data.result.toString();
      if (this.data.caclu) this.data.caclu = this.data.result.toString();
      let arr = this.data.result.match(/\d*\.?\d*$/); 
      this.data.result = this.data.result.replace(/\d*\.?\d*$/, '');
      this.data.caclu = this.data.caclu.replace(/\d*\.?\d*$/,'');
      if (arr){
        this.data.result += arr[0]/100;
        this.data.caclu += arr[0] / 100;
      }
    }
     else {
      this.data.result += event.target.id;
    }
    if (/^[\d|\+\-\*/\.]$/.test(event.target.id)) {
      this.data.caclu += event.target.id;
    }
    this.setData({
      caclu: this.data.caclu,
      result: this.data.result
    });
  },
  caclu() {
    let cacluArr = wx.getStorageSync('cacluArr') || [];;
    cacluArr.push({ caclu: this.data.caclu, result: this.data.result });
    wx.setStorageSync('cacluArr', cacluArr);
    let result = new rpn(this.data.caclu).calculate();
    let express = this.data.result + '=';
    if(result !== 0){
      this.setData({
        express: express || '',
        caclu: result || '',
        result: result || ''
      });
    }else{
      this.setData({
        express: express ,
        caclu: result,
        result: result 
      });
    }
  },
  clear() {
    this.setData({
      express: '',
      caclu: '',
      result: ''
    });
  },
})