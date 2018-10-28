let total = document.querySelector(".total")//最上面的ul；
let products = document.querySelectorAll(".product");//所有的产品；
let obj = {
    brand:{
        
    },
    size:{
        
    },
    sys:{
        
    },
    network:{
        
    }
};
products.forEach((item,index)=>{
    item.onclick = function(){
        let parentAttr = this.parentNode.getAttribute('data-type');
        obj[parentAttr].title = this.innerHTML;
        if(obj[parentAttr].index!==undefined){
            products[obj[parentAttr].index].classList.remove('active');

        }
        this.classList.add('active');
        obj[parentAttr].index = index;
        show()
    }
})
function show(){
    let str = '';
    for (const item in obj) {
        if(obj[item].title){
            str += `<li class='${item}'>
                        <span>${obj[item].title}</span>
                        <img src="../img/1_03.png" alt="">
                    </li>`
        }
    }
    total.innerHTML = str;
    var imgs = document.querySelectorAll('.total img');
    imgs.forEach((item,index)=>{
        item.onclick = function(){
            let parentClass = this.parentNode.className;
            products[obj[parentClass].index].classList.remove('active');
            obj[parentClass] = {};
            total.removeChild(this.parentNode);
        }
    })
}