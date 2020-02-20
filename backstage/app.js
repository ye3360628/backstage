const express=require('express');
//引入路由器
const session = require("express-session");
const proRouter=require('./routes/pro.js');
//引入body-parser中间件模块
const bodyParser=require('body-parser');
//跨域
const cors=require("cors");
let app=express();
app.use(cors({
  //允许:脚手架访问服务器
  origin:["http://127.0.0.1:8080","http://localhost:8080"],
  //每次请求加验证
  credentials:true
}))
//托管静态资源
app.use(express.static("public"));
//应用body-parser中间件
app.use(bodyParser.urlencoded({
	extended:false
}) ); 
//配置session对象
app.use(session({
  secret:"128位安全字符串",//加密条件
  resave:true,//请求更新数据
  saveUninitialized:true //保存初始数据
}))
//7:为服务器对象绑定端口 4000
app.listen(4000);
//应用路由器
// /user/reg
app.use('/pro',proRouter);



























