let total = document.querySelector(".total")//最上面的ul；
let products = document.querySelectorAll(".product");//所有的产品；
let lis = document.querySelectorAll('.ele li');
let obj = {}
lis.forEach((item,index)=>{
    obj['li'+index] = {};
    lis[index].c = 'li'+index;
})
show();
products.forEach((item,index)=>{
    item.onclick = function(){
        let c = this.parentNode.c;
        let totalItem = total.querySelector('.'+c);
        obj[c].title = this.innerHTML;
        if(obj[c].index!==undefined){
            products[obj[c].index].classList.remove('active');
        }else{
            totalItem.style.display = 'block';
        }
        totalItem.querySelector('span').innerHTML = this.innerHTML;
        this.classList.add('active');
        obj[c].index = index;
    }
})
function show(){
    let str = '';
    for (const item in obj) {
        str += `<li style='display:none;' class='${item}'>
                    <span></span>
                    <img src="../img/1_03.png" alt="">
                </li>`
    }
    total.innerHTML = str;
}