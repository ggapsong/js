function msg(str,data){
    var text = str;
    var parent = document.querySelector('.msg_box');
    var iconArr = ['../img/bingo.png','../img/jinggaoExclamation.png'];
    var div = document.createElement('div');
    div.className = 'delsuc_box';
    div.style.backgroundColor= data.color;
    div.innerHTML = `<img src="${iconArr[data.icon]}" alt="">
                        <span>${text}</span>`;
    parent.appendChild(div);
    
    mTween({
        el:div,
        attr:{
            top:0
        },
        time:20,
        cb(){
            setTimeout(()=>{
                mTween({
                    el:div,
                    attr:{
                        top:-40
                    },
                    time:20,
                    cb(){
                        setTimeout(()=>{
                            parent.removeChild(div);
                        },1000)
                    }
                });
            },1000)
        }
    });
}
