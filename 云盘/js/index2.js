let fnBtn = document.querySelector(".fn_btns");
let fnBtns = fnBtn.querySelectorAll(".fn_btns .active");
let fileParent = document.querySelector(".file_parent");
let num = 0;
let crumbsList = [];
// 生成目录树
document.querySelector('.menu_list').innerHTML = createTree(-1);
// 创建目录树
function createTree(id) {
    let str = "";
    data.forEach((e) => {
        if (e.pid == id) {
            str += `<li data-id=${e.id}>
                    <div>
                        <img src="../img/moref.png" alt="">
                        <span>${e.title}</span>
                    </div>`
            str += createTree(e.id);
            str += "</li>";
        }
    })
    if (!str == "") {
        str = `<ul style="display:none">${str}</ul>`;
    }
    return str;
}


//初始化文件开关
initOpenFile();

function initOpenFile() {

    //有子集的就给加上小三角
    document.querySelectorAll(".menu_list ul").forEach((e) => {
        if (e.parentNode.tagName == "LI") {
            e.parentNode.classList.add("on");
        } else {
            e.style.display = "block";
        }
    });
    //点击事件加给div
    //遇到的问题（如果加给li会出现没有ul的li会关闭）
    document.querySelectorAll(".on div").forEach((e) => {
        let ul;
        e.onclick = function (ev) {
            if (e.parentNode.className == "on") {
                e.parentNode.className = "active";
                //把li的id放到数组里面
                let id = e.parentNode.dataset.id;
                crumbsList.push(id);
                ul = this.nextElementSibling;
                ul.style.display = "block";
                //保证只有父级一人是打开状态
                let li = Array.from(e.parentNode.parentNode.children);
                li.forEach((e) => {
                    if (e !== this.parentNode && e.className !== "") {
                        e.className = "on";
                        e.querySelectorAll("ul").forEach((ul) => {
                            ul.style.display = "none";
                            ul.parentNode.className = "on";
                        })
                    }
                })
                //阻止冒泡
                ev.cancelBubble = true;
                ev.stopPropagation();
            } else if (e.parentNode.className == "active") {
                e.parentNode.className = "on";
                ul = this.nextElementSibling;
                ul.style.display = "none";
                ev.cancelBubble = true;
                ev.stopPropagation();
            };
            return crumbsList;
        };
    });
};
console.log(initOpenFile());

//渲染面包屑