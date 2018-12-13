let http = require("http");
let fs = require("fs");
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
    let path = "./view"
    if(Url.includes("/api")){
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
    }else{
        try{
            let data = fs.readFileSync(path+Url);
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