function msg(str, data) {
    var text = str;
    var parent = document.querySelector('.msg_box');
    var iconArr = ['../img/bingo.png', '../img/jinggaoExclamation.png'];
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
let fnBtn = document.querySelector(".fn_btns");
let fnBtns = fnBtn.querySelectorAll(".fn_btns .active");
let fileParent = document.querySelector(".file_parent");
let num = 0;


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


//点击删除的时候删除文件