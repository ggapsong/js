//先引入express
let express = require("express");
//路由
let router = express.Router();
let userArr = [
    {
        name:"aaa",
        pass:123
    },
    {
        name:"bbb",
        pass:123
    },
    {
        name:"ccc",
        pass:123
    }
]
//注册
router.post('/reg',(req,res)=>{
    let obj = req.body;
    let resData = {code:0,msg:""}
    if(obj.name==""||obj.pass==""){
        resData.code=1;
        resData.msg="账号或密码为空";
    }else{
        let o = userArr.find(e=>e.name==obj.name);
        if(o){
            resData.code=2;
            resData.msg="用户已存在";
        }else{
            userArr.push({
                name:obj.name,
                pass:obj.pass
            });
            resData.code=0;
            resData.msg="注册成功";
        }
    }
    res.send(resData);
})
//登陆
router.post("/login",(req,res)=>{
    let obj = req.body;
    let resData = {"code":"","msg":""}
    if(obj.name==""||obj.pass==""){
        resData.code=1;
        resData.msg="账户或者密码为空"
    }else{
        let o = userArr.find(e=>e.name==obj.name)
       //如果数据库里有可以登陆
        if(o){
             //密码正确
            if(o.pass==obj.pass){
                resData.code=0;
                resData.msg="登陆成功"
                res.cookie('name',o.name);
            }else{
                resData.code=2;
                resData.msg="密码错误"
            }
        }else{
            resData.code=3;
            resData.msg="账号不存在"
        }
    }
    res.send(resData)
})
router.get('/logout',(req,res)=>{
    res.cookie("name","")
    res.send('{"code":0,"msg":"退出成功"}');
})
module.exports = router;