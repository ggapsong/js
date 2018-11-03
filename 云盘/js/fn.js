function msg(str,data){
    var text = str;
    var color = data.color;
    var icon = data.icon;
    var iconArr = ['../img/icon1','../img/icon2'];
    var htmlText = `<div style='background-color:"${color}"'><img src='${iconArr[icon]}'/><span>${text}</span></div>`;
    console.log(htmlText);
}
