//找自己
function self(id) {
    return data.filter((item) => {
        return item.id == id;
    })[0]
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
    }
    return arr;
}

function createTree(id) {
    var str = ''
    data.forEach(e => {
        if (e.pid == id) {
            str += `<li data-id="${e.id}">
                        <p><span>${e.title}</span></p>
                    `;
            str += createTree(e.id);
            str += `</li>`
        }
    });
    if (str !== '') {
        str = `<ul style="display:none;">${str}</ul>`;
    }
    return str;
}
document.getElementById('tree-menu').innerHTML = createTree(-1)
document.getElementById('tree-menu').children[0].style.display = 'block';
initOpenFile();

function initOpenFile() {
    //有子集的就给加上小三角
    document.querySelectorAll("#tree-menu p").forEach((e) => {
        let id = e.parentNode.dataset.id;
        let arr = parents(id);
        e.style.paddingLeft = (arr.length - 1) * 28 + 40 + 'px'
        if (e.nextElementSibling) {
            e.className = 'has-child';
        }
    });
    //点击事件加给div
    //遇到的问题（如果加给li会出现没有ul的li会关闭）
    document.querySelectorAll("p.has-child").forEach((e) => {
        let ul;
        e.onclick = function (ev) {
            if (e.parentNode.className == "") {
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
                e.parentNode.className = "";
                ul = this.nextElementSibling;
                ul.style.display = "none";
                ev.cancelBubble = true;
                ev.stopPropagation();
            };
            let id = e.parentNode.dataset.id;
            
            renderCrumbs(parents(id));
            renderChild(child(id));
            
        };
    });
};

function renderCrumbs(arr) {
    let str = '';
    arr.forEach((e, i) => {
        if (i == arr.length - 1) {
            str += `<span>${e.title}</span>`
        } else {
            str += `<a>${e.title}</a>`
        }
    });
    document.querySelector('.bread-nav').innerHTML = str;
}
//找到子集
function child(id) {
    return data.filter((e) => {
        return e.pid == id;
    })
}

function renderChild(arr) {
    let str = "";
    arr.forEach((e) => {
        str += `<li class="folder-item">
                    <img src="../img/folder-b.png" alt="">
                    <span class="folder-name">${e.title}</span>
                    <input type="text" class="editor" value="${e.title}">
                    <label class="checked">
                        <input type="checkbox">
                        <span class="iconfont icon-checkbox-checked"></span>
                    </label>   
                </li>`
    })
    document.getElementById("folders").innerHTML = str;
}