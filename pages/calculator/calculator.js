

import rpn from '../../utils/rpn.js';

Page({
  data: {
    express: '',
    caclu:'',
    result:''
  },
  onLoad: function () {
    this.setData({
      
    })
  },
  express(event){
    this.data.express += event.target.id;
    console.log('this.data.express', this.data.express);
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
    this.setData({ express: '', caclu: '',result:'' });
  },
  
})