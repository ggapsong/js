let fnBtn = document.querySelector(".fn_btns");
let fnBtns = fnBtn.querySelectorAll(".fn_btns .active");
let fileParent = document.querySelector(".file_parent");
let num = 0;
let crumbsList = [];

fnBtns[0].addEventListener("click", add);
// 创建目录树
document.querySelector('.menu_list').innerHTML = createTree(-1);
// 获取目录树中所有的ul 给ul的父级添加 on 类，
$('.menu_list ul').forEach(e => {
    if (e.parentNode.tagName == 'LI') {
        e.parentNode.classList.add('on');
    } else {
        e.style.display = 'block';
    }
});
// 初始化文件开关
initOpenFile();

//提示弹窗
function msg(str, data) {
    var text = str;
    var parent = document.querySelector('.msg_box');
    var iconArr = ['../img/tc_06.png', '../img/tc_03.png'];
    var div = document.createElement('div');
    div.className = 'delsuc_box';
    div.style.backgroundColor = data.color;
    div.innerHTML = `<img src="${iconArr[data.icon]}" alt="">
                        <span>${text}</span>`;
    parent.appendChild(div);
    mTween({
        el: div,
        attr: {
            top: 0
        },
        time: 20,
        cb() {
            setTimeout(() => {
                mTween({
                    el: div,
                    attr: {
                        top: -40
                    },
                    time: 20,
                    cb() {
                        setTimeout(() => {
                            parent.removeChild(div);
                        }, 1000)
                    }
                });
            }, 1000)
        }
    });
}


//点击添加文件
function add(e) {
    num++
    let newfile = document.createElement("li");
    newfile.className = "lis";
    newfile.innerHTML = `
            <div class="select"></div>
            <div class="fileimg">
                <img src="../img/bigf_03.png" alt="">
            </div>
            <div class="name">目录${num}</div>
            <div>
                <input type="text" class="changename none">
            </div>
        `
    fileParent.appendChild(newfile);
    msg('添加文件成功', {
        color: '#86ce8b',
        icon: 0
    });
    e.preventDefault();
}
// 创建目录树
function createTree(id) {
    var str = ''
    data.forEach(e => {
        if (e.pid == id) {
            str += `<li data-id="${e.id}">
                        <div class="">
                            <img src="../img/moref.png" alt="">
                            <span>${e.title}</span>
                        </div>`;
            str += createTree(e.id);
            str += `</li>`
        }
    });
    if (str !== '') {
        str = `<ul style="display:none;">${str}</ul>`;
    }
    return str;
}

function $(select, one) {
    if (one) {
        return document.querySelector(select);
    } else {
        return document.querySelectorAll(select);
    }
}
// 初始化文件开关
function initOpenFile() {
    $('.on').forEach(e => {
        e.onclick = function (ev) {
            if (this.className == 'on') {
                let id = this.dataset.id;
                crumbsList.push(id);
                // 渲染面包屑
                crumbsListRender();
                this.querySelector('ul').style.display = 'block';
                this.className = 'active';
                var li = Array.from(this.parentNode.children);
                li.forEach(e => {
                    if (e !== this && e.className !== '') {
                        e.className = 'on';
                        e.querySelectorAll('ul').forEach(e => {
                            e.style.display = 'none';
                            e.parentNode.className = 'on';
                        })
                    }
                })
            } else {
                e.querySelectorAll('ul').forEach(e => {
                    e.style.display = 'none';
                    e.parentNode.className = 'on';
                })
            };
            ev.cancelBubble = true;
            ev.stopPropagation();
        }
    })
}

// 渲染面包屑
function crumbsListRender() {
    var str = '';
    console.log(crumbsList);
    crumbsList.forEach(e => {
        console.log(crumbsList);
        data.forEach(el => {
            if (e == el.id) {
                str += `<li class="fl">
                            <div class="detail">${el.title}</div>
                            <div class="img">
                                <img src="../img/right_03.png" alt="">
                            </div>
                        </li>`;
            }
        })
    });
    $('#crumbs_list', 1).innerHTML = str;
}