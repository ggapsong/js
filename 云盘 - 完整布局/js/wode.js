checkedAll.onclick = function(){
    if(this.checked){
        let lis = document.querySelectorAll("#folders li");
        lis.forEach((e)=>{
            if(e.className.indexOf("active")==-1){
                
            }
        })
    }
}