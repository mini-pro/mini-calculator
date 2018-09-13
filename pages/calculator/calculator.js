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
    } else {
      this.data.result += event.target.id;
    }
    if (/^[\d|\+\-\*/\%\.]$/.test(event.target.id)) {
      this.data.caclu += event.target.id;
    }
    this.setData({
      caclu: this.data.caclu,
      result: this.data.result
    });
  },
  caclu() {
    // rpn.calculate(this.data.caclu);
    let result = new rpn(this.data.caclu).calculate()
    let express = this.data.result + '=';
    this.setData({
      express: '',
      caclu: '',
      result: result
    });
    this.setData({
      express: express,
      caclu: result,
      result: result
    });
  },
  clear() {
    this.setData({
      express: '',
      caclu: '',
      result: 0
    });
  },

})