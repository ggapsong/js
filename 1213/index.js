//引入模块
let express = require("express");
//创建服务
let index = express();
//引入模板引擎nunjucks.js
let nunjucks = require("nunjucks");
let bodyparser= require('body-parser');
//cookie-parser
let cookie=require('cookie-parser');

//配置模板引擎适用范围
nunjucks.configure("views",{
    autoescape:true,
    //静态路径的名字
    express:index
})


//配置POST数据解析
let encode = bodyparser.urlencoded({extended:false});

//将编码解析加入到中间件当中
index.use(encode);
index.use(cookie());
index.use('/user',require('./router/user'))
//处理模板的路由
index.use("/",require("./router/template"));
//静态文件
index.use(express.static('./views'))
//监听
index.listen(8080);


//引入nunjucks->配置->处理模板的路由->静态文件的存放位置