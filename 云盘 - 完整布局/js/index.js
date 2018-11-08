let nowId = null;
//找自己
function self(id) {
    return data.filter((item) => {
        return item.id == id;
    })[0]
}
//找到子集
function child(id) {
    return data.filter((e) => {
        return e.pid == id;
    })
}
//找爸爸
function parent(id) {
    let pid = self(id).pid;
    return data.filter((item) => {
        return item.id == pid;
    })[0]
}
//找爸爸的爸爸们
function parents(id) {
    let arr = [];
    let obj = self(id);
    arr.push(obj)
    if (obj.pid !== -1) {
        arr = [...parents(obj.pid), ...arr]
    };
    return arr;
}
//先把-1传进去跟每一项的pid比较这样就把微云这一项找出来
document.getElementById('tree-menu').innerHTML = createTree(-1,-1);
//创建目录树
function createTree(id,level) {
    var str = ''
    level++;
    data.forEach(e => {
        if (e.pid == id) {
            str += `<li data-id="${e.id}" data-level="${level}">
                        <p style="padding-left:${level * 28 + 40 + 'px'}"><span>${e.title}</span></p>
                    `;
            str += createTree(e.id,level);
            str += `</li>`
        }
    });
    // if (str !== '') {
        str = `<ul style="display:none;">${str}</ul>`;
    // }
    return str;
}
document.getElementById('tree-menu').children[0].style.display = 'block';
// document.getElementById('tree-menu').children[0].firstChild.className = "open";
// document.getElementById('tree-menu').children[0].firstChild.children[1].style.display = "block";
// renderCrumbs(parents(0));
// renderChild(child(0));
// tree-menu的第一个子集是微云这一项   默认是展开状态;

//初始化文件
initOpenFile();
function initOpenFile() {
    //有子集的就给加上小三角并加padding
    document.querySelectorAll("#tree-menu p").forEach((e) => {
        let id = e.parentNode.dataset.id;
        let arr = parents(id);
        if (e.nextElementSibling) {
            e.className = 'has-child';
        }
    });
    document.querySelectorAll("p.has-child").forEach((e) => {
        let ul;
        e.onclick = function (ev) {
            let id = e.parentNode.dataset.id;
            if (e.parentNode.className == "") {
                nowId = id;
                renderCrumbs(parents(id));
                renderChild(child(id));
                e.parentNode.className = "open";
                ul = this.nextElementSibling;
                ul.style.display = "block";
                //保证只有父级一人是打开状态
                let li = Array.from(e.parentNode.parentNode.children);
                li.forEach((e) => {
                    if (e !== this.parentNode && e.className !== "") {
                        e.className = "";
                        e.querySelectorAll("ul").forEach((ul) => {
                            ul.style.display = "none";
                            ul.parentNode.className = "";
                        })
                    }
                })
                //阻止冒泡
                ev.cancelBubble = true;
                ev.stopPropagation();
            } else if (e.parentNode.className == "open") {
                let p = parent(id)
                renderCrumbs(parents(id).slice(0,parents(id).length-1));
                if(p){
                    nowId = p.id;
                    renderChild(child(p.id));
                }else{
                    nowId = null;
                    folders.innerHTML = '';
                }
                e.parentNode.className = "";
                ul = this.nextElementSibling;
                ul.style.display = "none";
                ul.querySelectorAll('.open').forEach(e=>{
                    e.className = '';
                    e.children[1].style.display = 'none';
                })
                ev.cancelBubble = true;
                ev.stopPropagation();
            }
            
        };
    });
};
//面包屑区域
function renderCrumbs(arr) {
    let inner = "";
    arr.forEach((e, i) => {
        if (i == arr.length - 1) {
            inner += `<span>${e.title}</span>`
        } else {
            inner += `<a data-id=${e.id}>${e.title}</a>`;
        }
    })
    document.querySelector(".bread-nav").innerHTML = inner;
}
let folders = document.querySelector("#folders");
//文件夹区域
function renderChild(arr) {
    let inner = "";
    arr.forEach((e) => {
        inner += `
                <li class="folder-item" data-id="${e.id}">
                    <img src="../img/folder-b.png" alt="">
                    <span class="folder-name">${e.title}</span>
                    <input type="text" class="editor" value="${e.title}">
                    <label class="checked">
                        <input type="checkbox">
                        <span class="iconfont icon-checkbox-checked"></span>
                    </label>   
                </li>
                `
    })
    document.querySelector("#folders").innerHTML = inner;
}

//点击面包屑切换视图
let nav = document.querySelector(".bread-nav");
nav.addEventListener("click", function (ev) {
    if (ev.target.tagName == "A") {
        let id = ev.target.dataset.id;
        renderCrumbs(parents(id));
        renderChild(child(id));
        renderMenuTree(id);
    }
})
// 渲染左侧列表
function renderMenuTree(id){
    if(id!==undefined){
        let ul = document.querySelector('li[data-id="'+id+'"]').children[1];
        ul.querySelectorAll('.open').forEach(e=>{
            e.className = '';
            e.children[1].style.display = 'none';
        })
    }else{
        alert('没传id');
    }
}
// 新建文件夹
document.querySelector('.create-btn').onclick = createFile;
function createFile(){
    if(nowId!==null){
        let obj = {
            id:new Date().getTime(),
            pid:nowId,
            title:'新建文件夹'
        };
        data.push(obj);
        renderChild(child(nowId));
        document.querySelector('.alert-success').innerHTML = '新建文件夹成功';
        document.querySelector('.alert-success').classList.add("alert-show");
        setTimeout(() => {
            document.querySelector('.alert-success').classList.remove("alert-show");
        }, 1000);
        // var li = document.querySelector('li[data-id="'+nowId+'"]');
        // var ul = li.children[1];
        // ul.innerHTML += `<li data-id="${obj.id}">
        //                     <p style="padding-left:${(li.dataset.level+1)*28+40}px" class="has-child"><span>新建文件夹</span></p>
        //                 </li>`
        renderMenuBF(nowId);
    }
}
// 传入id 渲染此id下面的子集 新建 删除 移动 都可以用
function renderMenuBF(id){
    var li = document.querySelector('li[data-id="'+id+'"]');
    li.removeChild(li.children[1]);
    li.innerHTML += createTree(id,li.dataset.level);
    li.children[1].style.display = 'block';
    initOpenFile();
}

folders.addEventListener('click',function(ev){
    var _this = ev.target
    if(_this.tagName=='INPUT'){
        if(_this.checked){
            _this.parentNode.parentNode.classList.add('active');
        }else{
            _this.parentNode.parentNode.classList.remove('active');
        }
    }
})
