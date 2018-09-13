

import rpn from '../../utils/rpn.js';

Page({
  data: {
    express: '',
    caclu: '',
    result: 0
  },
  onLoad: function () {
    this.setData({
      
    })
  },
  express(event){
    if (event.target.id === '*'){
      this.data.express +=  'x'
    }
   else if (event.target.id === '/') {
      this.data.express += '÷'
    }else{
      this.data.express += event.target.id;
    }
    if (/^[\d|\+\-\*/\%\.]$/.test(event.target.id)){
      this.data.caclu += event.target.id;
    }
    this.setData({ express: this.data.express,caclu:this.data.caclu});
  },
  caclu(){
    // rpn.calculate(this.data.caclu);
    let result = new rpn(this.data.caclu).calculate() 
    
    this.setData({ express: '', caclu: '', result: result});
  },
  clear(){
    this.setData({ express: '', caclu: '',result: 0 });
  },

})