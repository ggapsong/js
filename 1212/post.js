let http = require("http");
let fs =require('fs');
let userArr=[
    {
        name:'aaa',
        pass:123
    },
    {
        name:'bbb',
        pass:123
    },
    {
        name:'ccc',
        pass:123
    }
]
let app = http.createServer((res,req)=>{
    let Url=res.url;
    let path='./view';
    if(Url.includes("/api")){
        //请求数据
        if(Url.includes("/api/post")){
            let str="";
            res.on("data",(data)=>{
                str+=data
            })
            res.on("end",()=>{
                let data = JSON.parse(str)
                //判断输入内容是否为空
                if(data.name==""||data.pass==""){
                     req.write('{"code":1,"msg":"请输入内容"}');
                     req.end()
                }else{
                    //和数据库里的数据对比是否相同
                     let o = userArr.find(e=>e.name==data.name)
                     //相同
                     if(o){
                         req.write('{"code":2,"msg":"名字太火换个吧"}');
                         req.end()
                     }else{
                         //不相同
                         userArr.push({
                             name:data.name,
                             pass:data.pass
                         })
                         req.write('{"code":0,"msg":"注册成功"}');
                         req.end()
                     }
                }
            })
        }else if(Url.includes("/api/register")){
            let str = "";
                    res.on("data",(data)=>{
                        str+=data
                    })
                    res.on("end",()=>{
                        let data = JSON.parse(str)
                        //判断用户名
                        let mz = userArr.find(e=>e.name==data.name);
                        let mm = userArr.find(e=>e.pass==data.pass);
                        if(mz&&mm){
                            req.write('{"code":0,"msg":"登陆成功"}');
                            req.end();
                        }else if(!mm&&!mz){
                            req.write('{"code":3,"msg":"没有这个用户"}');
                            req.end();
                        }else if(!mm){
                            req.write('{"code":4,"msg":"密码错误"}');
                            req.end();
                        }
                    })
                }else if(Url.includes("/api/getUserList")){
                    req.write(JSON.stringify(userArr));
                    req.end();
                }
      
    }else{
        //读取文件
        try{
            let data=fs.readFileSync(path+Url);
            req.write(data);
            req.end();
           }catch(e){
            let data=fs.readFileSync(path+'/404.html');
            req.write(data);
            req.end(); 
           }
    }
})
app.listen(8080)
//1.请求数据||页面
//2.数据为空？
//3.和库里冲突吗
