let input = document.querySelectorAll(".top input"); //上面的输入框
let button = document.querySelector(".button"); //添加按钮
let listBox = document.querySelector(".list_box"); //ul
console.log(listBox);
let list = document.querySelector(".li"); //li
let str = "";
let index = 0;

button.onclick = function() {
  let first = input[0].value; //姓名输入框
  let second = input[1].value; //年龄输入框
  let third = input[2].value; //性别输入框
  if (first == "" && second == "" && third == "") {
    alert("请输入完整信息");
  } else if (first == "") {
    alert("请输入姓名");
  } else if (second == "") {
    alert("请输入年龄");
  } else if (third == "") {
    alert("请输入性别");
  } else {
    add();
  }

  function add() {
    let li = document.createElement("li");
    index++;
    li.innerHTML = `
            <div class="bg">
            <div class="input">
                <input type="checkbox">
            </div>
            <div class="card">
            ${index}
            </div>
            <div class="name">
            ${first}
            </div>
            <div class="age">
            ${second}
            </div>
            <div class="sex">
            ${third}
            </div>
            <div class="work">
                <img src="../img/1_03.png" alt="">
                <img src="../img/1_05.png" alt="">
                <img src="../img/1_07.png" alt="">
            </div>`;
    listBox.appendChild(li);
    input[0].value = "";
    input[1].value = "";
    input[2].value = "";
    let imgs = li.querySelectorAll("img");
    imgs[2].onclick = function() {
      listBox.removeChild(this.parentNode.parentNode.parentNode);
    };
    
    imgs[1].onclick = function() {
        let lis = imgs[1].parentNode.parentNode.parentNode.nextElementSibling
        if(lis){
            if(lis.nextElementSibling){
                listBox.insertBefore(li,lis.nextElementSibling)
            }else{
                listBox.appendChild(li);
            }
        }else{
            alert("到底啦");
        }
    };
    imgs[0].onclick = function() {
        let lis = imgs[0].parentNode.parentNode.parentNode.previousElementSibling
        if(lis){
            listBox.insertBefore(li,lis);
        }else{
            alert("已经是第一个了");
        }
    };
  }
};
