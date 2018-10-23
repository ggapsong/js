var DatePicker = (function() {
    var params = {};
    //根据年、月返回月天数    
    function getDays(year,month) {
        var days = 30,
            isLeapYear = false;
        //年份能被4整除且不能被100整除，或能被100整除且能被400整除，为闰年
        if((year%4==0 && year%100!=0)||(year%100==0 && year%400==0)) isLeapYear = true;
        switch(month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
            days = 31;
            break;
            case 2 :
            isLeapYear ? days = 29 : days = 28;
            break;
        }
        return days;
    };
    //根据年、月、日返回星期X
    function getDayIndex(year,month,day) {
        return new Date(year,month-1,day).getDay();
    };
    //初始化UI
    function initUI(o) {
        var shell = document.createElement('div'),  //日历框
            shellCtrl = document.createElement('div'),  //年月选择器
            shellWeek = document.createElement('p'),  //week
            shellDates = document.createElement('ul'),  //日期标签
            shellMonths = document.createElement('ul'), //月标签
            shellYears = document.createElement('ul'),  //年份标签
            curDate = new Date(),  //当前时间
            cName =  o.cName,  //日历框className
            yearId = cName + '-year',
            monthId = cName + '-month',
            choseId = cName + '-chose',
            choseYearsId = cName + '-years',
            prevBtnId = cName + '-prev',
            nextBtnId = cName + '-next',
            shellId = 'J-' + cName;
        shell.className = cName;
        shell.id = shellId;
        shellCtrl.innerHTML = '<a href="javascript:;" id='+ prevBtnId +' class='+ cName +'-prev><</a><span id='+ choseId +' view="date"><span id='+ yearId +'>'+ curDate.getFullYear() +'年</span><span id='+ monthId +'>'+ (curDate.getMonth()+1) +'月</span></span><span style="display:none" id='+ choseYearsId +'>2010-2019</span><a href="javascript:;" id='+ nextBtnId +' class='+ cName +'-next>></a>';
        shellWeek.innerHTML = '<span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>';
        shellDates.className = cName + '-dates';
        shellMonths.className = cName + '-months';
        shellYears.className = cName + '-years';
        shellYears.style.display = 'none';
        shellMonths.innerHTML = '<li>一月</li><li>二月</li><li>三月</li><li>四月</li><li>五月</li><li>六月</li><li>七月</li><li>八月</li><li>九月</li><li>十月</li><li>十一月</li><li>十二月</li>';
        //添加主要html结构
        shell.appendChild(shellCtrl);
        shell.appendChild(shellWeek);
        shell.appendChild(shellDates);
        shell.appendChild(shellMonths);    
        shell.appendChild(shellYears);
        document.body.appendChild(shell);    
        params = $.extend(params,{
            oYear : document.getElementById(yearId),
            oMonth : document.getElementById(monthId),
            oChose : document.getElementById(choseId),
            oChoseYears : document.getElementById(choseYearsId),
            oShell : shell,
            shellId : shellId, 
            oDates : shellDates,
            oMonths : shellMonths,
            oWeeks : shellWeek,
            oYears : shellYears,
            prevBtn : document.getElementById(prevBtnId),
            nextBtn : document.getElementById(nextBtnId)
        });
        fillDates(parseInt(document.getElementById(yearId).innerHTML),parseInt(document.getElementById(monthId).innerHTML));
        //下划线突出当前日期
        for(var i = 0; i < shellDates.getElementsByTagName('li').length; i ++) {
            if(!shellDates.getElementsByTagName('li')[i].getAttribute('date')) continue;
            if(shellDates.getElementsByTagName('li')[i].getAttribute('date').match(/\d*$/)[0] == new Date().getDate()) {
                shellDates.getElementsByTagName('li')[i].style.fontWeight = 'bold';
            }
        }
        clickDay(o.elem);
    };
    //根据年月填充日期 共42个数字
    function fillDates(year,month) {
        var datesContain = document.getElementsByTagName('ul')[0],
            start = getDayIndex(year,month,1), //获取当前年月第一天的星期下标
            prevMonthDays = getDays(year,month - 1),  //获取上个月天数
            curMonthDays = getDays(year,month),
            htmlStr = '',
            n = 1,
            j = 1;
        prevMonthDays = month==1 ? 31 : prevMonthDays;
        start = start==0 ? 7 : start;
        for(var i = prevMonthDays - start + 1; i <= prevMonthDays; i++) {
            htmlStr += '<li class="prev">'+ i +'</li>';
        }
        while(n <= curMonthDays) {
            htmlStr += '<li date='+ year +'-'+ month +'-'+ n +'>'+ n +'</li>';
            n ++;
        }
        while(j <= 42-start-curMonthDays) {
            htmlStr += '<li class="next">'+ j +'</li>';
            j ++;
        }
        datesContain.innerHTML = htmlStr;        
    };
    //填充年份集合
    function fillYears() {
        var start = params.oChoseYears.innerHTML.split('-')[0] - 0,
            end1 = params.oChoseYears.innerHTML.split('-')[1]- 0,
            htmlStr = '';
        params.oYears.innerHTML = '';
         htmlStr = '<li class="prev">'+ (start-1) +'</li>'
         while(start <= end1) {
             htmlStr += '<li year='+ start +'>'+ start +'</li>';
             start ++;
         }     
         htmlStr += '<li class="next">'+ start +'</li>';
         params.oYears.innerHTML = htmlStr;    
    };
    //事件集合
    function bind(o) {
        //切换月份/日期视图
        params.oChose.onclick = function() {
             var view = this.getAttribute('view');
             if(view == 'date') {
                 params.oDates.style.display = 'none';
                 params.oWeeks.style.display = 'none';
                 params.oMonths.style.display = 'block';
                 this.setAttribute('view','month');
                 params.oMonth.style.display = 'none';
             } else if(view == 'month') {
                 var year = parseInt(params.oYear.innerHTML),
                     singular = String(year).match(/\d$/);
                     start = year -singular -1,
                     end = start+10,
                     htmlStr = '';
                 params.oChoseYears.innerHTML = (start+1) + '-' + end;
                 htmlStr = '<li class="prev">'+ start +'</li>'
                 while(start+1 <= end) {
                     htmlStr += '<li year='+ (start+1) +'>'+ (start+1) +'</li>';
                     start ++;
                 }     
                 htmlStr += '<li class="next">'+ (start+1) +'</li>';
                 params.oYears.innerHTML = htmlStr;        
                 clickYear();     
                 params.oDates.style.display = 'none';
                 params.oWeeks.style.display = 'none';
                 params.oMonths.style.display = 'none';
                 this.setAttribute('view','year');
                 params.oChose.style.display = 'none';
                 params.oChoseYears.style.display = '';
                 params.oYears.style.display = 'block';
             }
        };
        //点击年集合
        params.oChoseYears.onclick = function() {
            this.style.display = 'none';
            params.oChose.style.display = '';
            params.oChose.setAttribute('view','date');
            params.oMonth.style.display = '';
            params.oDates.style.display = 'block';
            params.oMonths.style.display = 'none';
            params.oYears.style.display = 'none';
            params.oWeeks.style.display = 'block';
        };
        //点击月份
        var n = 0;
        while(n < 12) {
            params.oMonths.getElementsByTagName('li')[n].onclick = function() {
                switch(this.innerHTML) {
                    case '一月' :
                    params.oMonth.innerHTML = '1月';
                    break;
                    case '二月' :
                    params.oMonth.innerHTML = '2月';
                    break;
                    case '三月' :
                    params.oMonth.innerHTML = '3月';
                    break;
                    case '四月' :
                    params.oMonth.innerHTML = '4月';
                    break;
                    case '五月' :
                    params.oMonth.innerHTML = '5月';
                    break;
                    case '六月' :
                    params.oMonth.innerHTML = '6月';
                    break;
                    case '七月' :
                    params.oMonth.innerHTML = '7月';
                    break;
                    case '八月' :
                    params.oMonth.innerHTML = '8月';
                    break;
                    case '九月' :
                    params.oMonth.innerHTML = '9月';
                    break;
                    case '十月' :
                    params.oMonth.innerHTML = '10月';
                    break;
                    case '十一月' :
                    params.oMonth.innerHTML = '11月';
                    break;
                    case '十二月' :
                    params.oMonth.innerHTML = '12月';
                    break;
                }
                params.oMonth.style.display = '';
                params.oMonths.style.display = 'none';
                params.oDates.style.display = 'block';
                params.oWeeks.style.display = 'block';
                params.oChose.setAttribute('view','date');
                fillDates(parseInt(params.oYear.innerHTML),parseInt(params.oMonth.innerHTML));
                clickDay(o.elem);
            };
            n ++;
        }        
        //点击左按钮
        params.prevBtn.onclick = function() {
            var view = params.oChose.getAttribute('view');
            if(view == 'date') {              
                var year = parseInt(params.oYear.innerHTML),
                    month = parseInt(params.oMonth.innerHTML);
                if(month > 1) {
                    params.oMonth.innerHTML = --month + '月';
                } else {
                    params.oYear.innerHTML = --year + '年';
                    params.oMonth.innerHTML = 12 + '月';
                }
            } else if(view == 'year') {
                var yearStart = params.oChoseYears.innerHTML.split('-')[0],
                    yearStart = yearStart - 10,
                    yearEnd = yearStart + 9;
                params.oChoseYears.innerHTML = yearStart + '-' + yearEnd;
                fillYears();
                clickYear();
            }
            else {
                var year = parseInt(params.oYear.innerHTML);
                params.oYear.innerHTML = --year + '年';
            }
            fillDates(parseInt(params.oYear.innerHTML),parseInt(params.oMonth.innerHTML));
            clickDay(o.elem);
        };
        //点击右按钮
        params.nextBtn.onclick = function() {
            var view = params.oChose.getAttribute('view');
            if(view == 'date') {              
                var year = parseInt(params.oYear.innerHTML),
                    month = parseInt(params.oMonth.innerHTML);
                if(month < 12) {
                    params.oMonth.innerHTML = ++month + '月';
                } else {
                    params.oYear.innerHTML = ++year + '年';
                    params.oMonth.innerHTML = 1 + '月';
                }
            } else if(view == 'year') {
                var yearStart = params.oChoseYears.innerHTML.split('-')[0] - 0,
                    yearStart = yearStart + 10,
                    yearEnd = yearStart + 9;
                params.oChoseYears.innerHTML = yearStart + '-' + yearEnd;
                fillYears();
                clickYear();
            } else {
                var year = parseInt(params.oYear.innerHTML);
                params.oYear.innerHTML = ++year + '年';
            }
            fillDates(parseInt(params.oYear.innerHTML),parseInt(params.oMonth.innerHTML));
            clickDay(o.elem);
        };
        document.body.onclick = function() {
            if(document.getElementById(params.shellId)) document.body.removeChild(params.oShell);
        };
        $('#'+params.shellId).click(function(e){
            e && e.stopPropagation ?  e.stopPropagation() : e.cancelBubble=true;
        });
    };
    //单击日期
    function clickDay(elem) {
        var m = 0,
            dayList = params.oDates.getElementsByTagName('li');
        while(m < dayList.length) {
            dayList[m].onclick = function() {
                if(!this.getAttribute('date')) return false;
                elem.value = this.getAttribute('date');
                document.body.removeChild(params.oShell);
            };
            m ++;
        }
    };
    //点击年份
    function clickYear() {
        //点击年份
        var yearStart = 0;
        while(yearStart < 12) {        
            params.oYears.getElementsByTagName('li')[yearStart].onclick = function() {
                if(!this.getAttribute('year')) return false;
                var year = this.innerHTML;
                params.oChose.style.display = '';
                params.oChose.setAttribute('view','month');
                params.oYear.innerHTML = year + '年';
                params.oYears.style.display = 'none';
                params.oChoseYears.style.display = 'none';
                params.oMonths.style.display = 'block';
            };
            yearStart ++;
        }
    };
    var O = function() {};
    O.prototype.init = function(config) {
        this.elem = document.getElementById(config.id);
        this.cName = config.cName;
        var _this = this;
        var st;    
        $('#'+config.id).click(function(e){
            e && e.stopPropagation ?  e.stopPropagation() : e.cancelBubble=true;
            if(document.getElementById(params.shellId)) document.body.removeChild(params.oShell);
            initUI(_this);
            var left = $(this).offset().left,
                top = $(this).offset().top,
                h = $(this).outerHeight(),
                bH = $('body').height(),
                oSH = params.oShell.offsetHeight;
            params.oShell.style.left = left + 'px';
            params.oShell.style.top = (top+h) + 'px';
            if(bH-top-h < oSH) {
                params.oShell.style.top =(top-oSH) + 'px';
            }
            //绑定事件
            bind(_this);
        });    
    };
    return O;
})();