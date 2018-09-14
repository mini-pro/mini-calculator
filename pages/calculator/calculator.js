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
    } 
    else if (event.target.id === '%') {
      let arr = this.data.result.match(/\d*$/); 
      this.data.result = this.data.result.replace(/\d*$/, '');
      this.data.caclu = this.data.caclu.replace(/\d*$/,'');
      console.log('this.data.result..', this.data.result);
      if (arr){
        console.log('arr', arr);
        this.data.result += arr[0]/100;
        console.log('this.data.result ', this.data.result );
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
    // rpn.calculate(this.data.caclu);
    console.log('result', this.data.caclu);
    let result = new rpn(this.data.caclu).calculate();
    console.log('result', result);
    let express = this.data.result + '=';
    if(result !== 0){
      this.setData({
        express: '',
        caclu: '',
        result: result
      });
      this.setData({
        express: express || '',
        caclu: result || '',
        result: result || ''
      });
    }else{
      this.setData({
        express: '',
        caclu: '',
        result: result
      });
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