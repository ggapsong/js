let nowId = 0;
let checkedAll = document.querySelector("#checked-all");
//点击全选按钮
checkedAll.onclick = function () {
    //如果为选中状态找到li加active状态并把input的checked状态改为true；否则反之；
    if (this.checked) {
        let lis = document.querySelectorAll("#folders li");
        lis.forEach((e, i) => {
            if (e.className.indexOf("active") == -1) {
                e.classList.add("active");
                e.querySelector('input[type="checkbox"]').checked = true;
            }
        });
        data.forEach((e, i) => {
            if (e.pid == nowId) {
                e.checked = true;
            }
        });
    } else {
        let lis = document.querySelectorAll("#folders li");
        lis.forEach((e, i) => {
            if (e.className.indexOf("active") >= 0) {
                e.classList.remove("active");
                e.querySelector('input[type="checkbox"]').checked = false;
            }
        });
        data.forEach((e, i) => {
            if (e.pid == nowId) {
                e.checked = false;
            }
        });
    }
};
//找自己
function self(id) {
    return data.filter(item => {
        return item.id == id;
    })[0];
}
//找到子集
function child(id) {
    return data.filter(e => {
        return e.pid == id;
    });
}
//找爸爸
function parent(id) {
    let pid = self(id).pid;
    return data.filter(item => {
        return item.id == pid;
    })[0];
}
//找爸爸的爸爸们
function parents(id) {
    let arr = [];
    let obj = self(id);
    arr.push(obj);
    if (obj.pid !== -1) {
        arr = [...parents(obj.pid), ...arr];
    }
    return arr;
}
//删子集
function delChild(id) {
    for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (e.pid == id) {
            data.splice(i, 1);
            i--;
            for (let i2 = 0; i2 < data.length; i2++) {
                const e2 = data[i2];
                if (e2.pid == e.id) {
                    delChild(e.id);
                    break;
                }
            }
        }
    }
}

//先把-1传进去跟每一项的pid比较这样就把微云这一项找出来
document.getElementById("tree-menu").innerHTML = createTree(-1, -1);
//创建目录树
function createTree(id, level) {
    var str = "";
    level++;
    data.forEach(e => {
        if (e.pid == id) {
            str += `<li data-id="${e.id}" data-level="${level}">
                        <p style="padding-left:${level * 28 +
                          40 +
                          "px"}"><span>${e.title}</span></p>
                    `;
            str += createTree(e.id, level);
            str += `</li>`;
        }
    });
    // if (str !== '') {
    str = `<ul style="display:none;">${str}</ul>`;
    // }
    return str;
}
// tree-menu的第一个子集是微云这一项   默认是展开状态;
document.getElementById("tree-menu").children[0].style.display = "block";
document.getElementById("tree-menu").children[0].firstChild.className = "open";
document.getElementById(
    "tree-menu"
).children[0].firstChild.children[1].style.display = "block";
renderCrumbs(parents(0));
renderChild(child(0));

//初始化文件
initOpenFile();

function initOpenFile() {
    //有子集的就给加上小三角并加padding
    document.querySelectorAll("#tree-menu p").forEach(e => {
        // let id = e.parentNode.dataset.id;
        // let arr = parents(id);
        if (e.nextElementSibling && e.nextElementSibling.innerHTML !== "") {
            e.className = "has-child";
        }
    });
    //把点击事件加给了p新建了之后也会有点击事件
    document.querySelectorAll("p").forEach(e => {
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
                li.forEach(e => {
                    if (e !== this.parentNode && e.className !== "") {
                        e.className = "";
                        e.querySelectorAll("ul").forEach(ul => {
                            ul.style.display = "none";
                            ul.parentNode.className = "";
                        });
                    }
                });
                //阻止冒泡
                ev.cancelBubble = true;
                ev.stopPropagation();
            } else if (e.parentNode.className == "open") {
                let p = parent(id);
                renderCrumbs(parents(id).slice(0, parents(id).length - 1));
                if (p) {
                    nowId = p.id;
                    renderChild(child(p.id));
                } else {
                    nowId = null;
                    folders.innerHTML = "";
                }
                e.parentNode.className = "";
                ul = this.nextElementSibling;
                ul.style.display = "none";
                ul.querySelectorAll(".open").forEach(e => {
                    e.className = "";
                    e.children[1].style.display = "none";
                });
                ev.cancelBubble = true;
                ev.stopPropagation();
            }
        };
    });
}
//面包屑区域
function renderCrumbs(arr) {
    let inner = "";
    arr.forEach((e, i) => {
        if (i == arr.length - 1) {
            inner += `<span>${e.title}</span>`;
        } else {
            inner += `<a data-id=${e.id}>${e.title}</a>`;
        }
    });
    document.querySelector(".bread-nav").innerHTML = inner;
    //取消所有的checked
    if (checkedAll.checked) checkedAll.checked = false;
    data.forEach(e => {
        if (e.checked) {
            e.checked = false;
        }
    });
}
let folders = document.querySelector("#folders");
//文件夹区域
function renderChild(arr) {
    let inner = "";
    arr.forEach(e => {
        inner += `
                <li class="folder-item ${e.checked ? "active" : ""}" data-id="${
      e.id
    }">
                    <img src="../img/folder-b.png" alt="">
                    <span class="folder-name">${e.title}</span>
                    <input type="text" class="editor" value="${e.title}">
                    <label class="checked">
                        <input type="checkbox" ${e.checked ? "checked" : ""}>
                        <span class="iconfont icon-checkbox-checked"></span>
                    </label>   
                </li>
                `;
    });
    document.querySelector("#folders").innerHTML = inner;
}

//点击面包屑切换视图
let nav = document.querySelector(".bread-nav");
nav.addEventListener("click", function (ev) {
    if (ev.target.tagName == "A") {
        let id = ev.target.dataset.id;
        nowId = id;
        renderCrumbs(parents(id));
        renderChild(child(id));
        renderMenuTree(id);
    }
});
// 渲染左侧列表

function renderMenuTree(id) {
    if (id !== undefined) {
        let ul = document.querySelector('li[data-id="' + id + '"]').children[1];
        ul.querySelectorAll(".open").forEach(e => {
            e.className = "";
            e.children[1].style.display = "none";
        });
    } else {
        alert("没传id");
    }
}
// 新建文件夹
document.querySelector(".create-btn").onclick = createFile;
let i = 0;

function createFile() {
    i++;
    let obj = {
        id: new Date().getTime(),
        pid: nowId,
        title: `新建文件夹(${i})`
    };
    //往数据里面添加数据并渲染文件视图
    data.push(obj);
    renderChild(child(nowId));

    //新建成功提示弹窗
    msg("新建文件夹成功", 0);
    renderMenuBF(nowId);
    initOpenFile();
    if (checkedAll.checked) {
        checkedAll.checked = false;
    }
    // }
}
// 传入id 渲染此id下面的子集 新建 删除 移动 都可以用
function renderMenuBF(id) {
    var li = document.querySelector('li[data-id="' + id + '"]');
    li.removeChild(li.children[1]);
    li.innerHTML += createTree(id, li.dataset.level);
    li.children[1].style.display = "block";
    initOpenFile();
}
//文件checked状态

folders.addEventListener("click", function (ev) {
    var el = ev.target;
    if (el.tagName == "INPUT" && el.type == "checkbox") {
        const input = el;
        let id = input.parentNode.parentNode.dataset.id;
        if (input.checked) {
            for (let i = 0; i < data.length; i++) {
                const e = data[i];
                if (e.id == id) {
                    e.checked = true;
                    break;
                }
            }
            input.parentNode.parentNode.classList.add("active");
            let lis = folders.querySelectorAll("li");
            let inputs = folders.querySelectorAll('input[type="checkbox"]:checked');
            if (lis.length == inputs.length) {
                checkedAll.checked = true;
            }
        } else {
            input.parentNode.parentNode.classList.remove("active");
            for (let i = 0; i < data.length; i++) {
                const e = data[i];
                if (e.id == id) {
                    e.checked = false;
                    break;
                }
            }
            if (checkedAll.checked) {
                checkedAll.checked = false;
            }
        }
    }
});
//双击重命名
// folders.ondblclick = function(e){
//     if(e.target.className == "folder-name"){
//         let folderName = e.target;
//         let editor = e.target.nextElementSibling
//             folderName.style.display = "none";
//             editor.style.display = "block";
//             editor.select();
//     }
// }
//右键菜单
folders.addEventListener("contextmenu", function (e) {
    let rightmenu = document.querySelector("#contextmenu");
    let now = {
        x: e.clientX,
        y: e.clientY
    };
    // if (e.target.tagName == "IMG") {

    //     // rightmenu.style.top = now.y + "px";
    //     // rightmenu.style.left = now.x + "px";
    //     // rightmenu.style.display = "block";
    // }
    if (e.target.tagName == "LI") {
        let folderName = e.target.querySelector(".folder-name");
        let editor = e.target.querySelector(".editor");
        rightmenu.style.top = now.y + "px";
        rightmenu.style.left = now.x + "px";
        rightmenu.style.display = "block";
        let btns = rightmenu.querySelectorAll("li");
        //重命名
        btns[2].onclick = function () {
            let id = editor.parentNode.dataset.id;
            let s = self(id);
            let nows = child(s.pid);
            folderName.style.display = "none";
            editor.style.display = "block";
            rightmenu.style.display = "none";
            editor.select();
            let inner = folderName.innerHTML;
            editor.onkeypress = function (ev) {
                if (ev.keyCode == 13) {
                    changeName();
                    renderMenuBF(nowId);
                    initOpenFile();
                }
            };
            editor.onblur = function () {
                changeName();
                renderMenuBF(nowId);
                initOpenFile();
            };

            function changeName() {
                if (editor.value == "") {
                    msg("请输入正确的文件夹名", 1);
                } else {
                    if (inner == editor.value) {
                        folderName.style.display = "block";
                        editor.style.display = "none";
                        msg("文件名修改成功", 0);
                    } else {
                        var can = true;
                        for (let i = 0; i < nows.length; i++) {
                            if (id != nows[i].id && editor.value == nows[i].title) {
                                can = false;
                            }
                        }
                        if (can) {
                            folderName.style.display = "block";
                            folderName.innerHTML = editor.value;
                            editor.style.display = "none";
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].id == id) {
                                    data[i].title = editor.value;
                                    break;
                                }
                            }
                            msg("文件名修改成功", 0);
                        } else {
                            msg("重名了", 1);
                            editor.focus();
                        }
                    }
                }
            }
        };
    }
    e.preventDefault();
    folders.addEventListener("mousedown", function () {
        rightmenu.style.display = "none";
    });
});
//提示框
function msg(str, type) {
    var types = ["success", "warning"];
    document.querySelector(".alert-" + types[type]).innerHTML = str;
    document.querySelector(".alert-" + types[type]).classList.add("alert-show");
    setTimeout(() => {
        document
            .querySelector(".alert-" + types[type])
            .classList.remove("alert-show");
    }, 1000);
}

//删除
let delBtn = document.querySelector(".del-btn");
let confirm = document.querySelector(".confirm");
let confirmNavs = confirm.querySelectorAll("nav a");
delBtn.onclick = function () {
    let actives = document.querySelectorAll("#folders li.active");
    if (actives.length > 0) {
        showConfirm(actives.length);
    } else {
        msg("请选择要删除的文件", 1);
    }
};

confirmNavs[0].onclick = function () {
    //删除所有checked的
    for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (e.checked) {
            data.splice(i, 1);
            // 因为当前遍历的元素已经被删除了，所有的项目都往前提，所以当前的i要减1
            delChild(e.id);
            i--;
        }
    }
    renderChild(child(nowId));
    renderMenuBF(nowId);
    hideConfirm();
    if (checkedAll.checked) {
        checkedAll.checked = false;
    }
};
//点击取消和clos把提示框隐藏
confirmNavs[1].onclick = hideConfirm;
confirm.querySelector(".clos").onclick = hideConfirm;
//封装的删除提示框
function showConfirm(type) {
    if (type == 1) {
        confirm.querySelector("p").innerHTML = "确定要删除这个文件夹吗?";
    } else {
        confirm.querySelector("p").innerHTML = "确定要删除这些文件夹吗?";
    }
    confirm.classList.add("confirm-show");
}

function hideConfirm(type) {
    confirm.classList.remove("confirm-show");
}
//框选
folders.onmousedown = function (e) {
    let sel = document.createElement("div");
    sel.className = "sel";
    document.body.appendChild(sel);
    let start = {
        x: e.clientX,
        y: e.clientY
    };
    sel.style.top = start.y + "px";
    sel.style.left = start.x + "px";
    document.onmousemove = function (e) {
        let now = {
            x: Math.min(e.clientX, start.x),
            y: Math.min(e.clientY, start.y)
        };
        let WH = {
            x: Math.abs(e.clientX - start.x),
            y: Math.abs(e.clientY - start.y)
        };
        sel.style.height = WH.y + "px";
        sel.style.width = WH.x + "px";
        sel.style.top = now.y + "px";
        sel.style.left = now.x + "px";
        let lis = folders.querySelectorAll("li");
        lis.forEach(e => {
            let id = e.dataset.id;
            //判断是否碰撞
            if (isBoon(e, sel)) {
                let input = e.querySelector("input[type=checkbox]");
                input.checked = true
                e.classList.add("active");
                data.forEach((e, i) => {
                    if (e.id == id) {
                        e.checked = true;
                    }
                });
            }
        })


    };
    document.onmouseup = function (e) {
        document.onmouseup = document.onmousemove = null;
        document.body.removeChild(sel)
    };
    e.preventDefault();


};
//检测碰撞公式
function isBoon(el, el2) {
    let elRect = el.getBoundingClientRect();
    let el2Rect = el2.getBoundingClientRect();
    if (elRect.left > el2Rect.right ||
        el2Rect.left > elRect.right ||
        elRect.top > el2Rect.bottom ||
        el2Rect.top > elRect.bottom) {
        return false;
    }
    return true;
}