/*
//	js 是单线程从上到下同步执行的，一旦遇到报错就会退出，中断执行。
//	所谓同步，就是指，按从上至下的顺序执行，一旦遇到错误就会退出程序，后面的代码将不会运行。
//	function test(){...};  test();   当执行到 test（）时，会执行函数里的代码，遇到错误就退出了，所以done不会执行打印出来。
//	js 在运行时，会先全局扫描 var但不赋值  和 function 声明的对象。
//	所以，在一个块script(文件)中，函数可以在调用之后进行“定义式”定义；但在两个块中，定义函数所在的块必须在函数被调用的块之前。
*/

function pageLoad(){

// 1.选择文件，转换为数组arrPower(),arrRepower()
	var arrPower=new Array(); //有功数组
    var arrRepower=new Array();//无功数组
    var arrPowerShow=new Array();//传给图像的有功数组
    var arrRepowerShow=new Array();//传给图像的有功数组
    var arrDifferShow=new Array();//做差
    var hourSelect=new String(); //图片保存名称即时间
    //  0:00  0:01  0:02 ···  0:59
	//  1:00  1:01       ···  1:59
	var arrxAxis=new Array();//X轴坐标
	var hourStr=new Array();
	var minStr=new Array();
		for(var j=0;j<24;j++){	
			hourStr[j]=new Array();
			for (var i=0;i<60;i++) {
				if(i<10){
					minStr[i]='0'+i;  //
				}
				else{
					minStr[i]=i.toString();
				}	
				hourStr[j][i]=j.toString()+':'+minStr[i];
			};		
		};	
	arrxAxis = [].concat.apply([], hourStr);
	
//  选择文件按钮改变
    document.getElementById('clickFile').onclick=function(){
    	document.getElementById('excel-file').click();
    };
//  选择日期按钮改变
//  document.getElementById('clickDate').onclick=function(){
//  	document.getElementById('dateNum').click();
//  };
    
    //给input标签绑定change事件，一上传选中的.xls文件就会触发该函数
    $('#excel-file').change(function(e) {
        var files = e.target.files;
        var fileReader = new FileReader();
        fileReader.onload = function(ev) {
            try {
                var data = ev.target.result
                var workbook = XLSX.read(data, {
                    type: 'binary'
                }) // 以二进制流方式读取得到整份excel表格对象
                var persons = []; // 存储获取到的数据
            } catch (e) {
                console.log('文件类型不正确');
                return;
            }
            // 表格的表格范围，可用于判断表头是否数量是否正确
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    console.log('fromTo:' + fromTo);
                    persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    break; // 如果只取第一张表，就取消注释这行
                }
            }
            //在控制台打印出来表格中的数据
            console.log('表格数据persons:');
            console.log(persons);
            var strKey   =  Object.keys(persons[0]); //标签
            var strKey2  =  strKey[0];   //第2列标签
            var strKey31 =  strKey[30];  //第32列标签
            
            
            console.log('标签：');
            console.log(strKey);
            console.log('第2列标签名称：');
            console.log(strKey2);
            console.log('第32列标签名称：');
            console.log(strKey31);
            console.log('第2列标签对应数据:');
            console.log(persons[0][strKey2]);
//          console.log("persons类型："+ typeof persons ); //object
//          console.log("第一行有功："+ persons[0].有功功率,"第一行无功："+persons[0].无功功率);
//          console.log("第一行有功："+ persons[1].有功功率,"第一行无功："+persons[1].无功功率);
//          console.log("有功类型："+ typeof persons[0].有功功率  +'<br>'); //string
//          var x=parseFloat(persons[0].有功功率);
            
//          console.log("x："+ x);
//          console.log("有功类型转换后x："+ typeof x);//number
//          console.log('文件persons长度:'+ persons.length);
                       
//          创建有功数组和无功数组
            for (var i=0;i<persons.length;i++) {

            	arrPower[i]=parseFloat(persons[i][strKey2]);
            	arrRepower[i]=parseFloat(persons[i][strKey31]);
            	
            };
//          console.log("有功数组arrPower："+arrPower);
//          console.log("有功数组arrPower类型："+typeof arrPower);
//          console.log("有功第1个值："+arrPower[0]);
//          console.log("有功第1个值类型："+typeof arrPower[0]);
//          console.log("有功第4个值："+arrPower[3]);
//  		console.log("有功第4个值类型："+typeof arrPower[3]);
    		   		
        };
       
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
    });



// 2.提交日期按钮，取所选小时字符串转为数字  对应功率数据片段
	document.getElementById('postHour').onclick=function(){
		var hourElt=document.getElementById('dateNum');
	    hourSelect=hourElt.value;
		console.log("所选时间hour：" + hourSelect);
//		console.log("所选时间的类型：" +typeof hourSelect);
		var hourNum=parseFloat(hourSelect.slice(-2));
//		console.log("hour后两位转数字：" + hourNum);
//		console.log("后两位转数字类型确认：" +typeof hourNum);
		
	//2.1.截取相对片段的功率值 1440*（hourNum-1）:1440*hourNum-1  例中将1440看作10
//		console.log('有功数组和无功数组：');
//		console.log(arrPower);
//		console.log(arrRepower);
//		console.log("有功数组长度：" + arrPower.length);
		
		arrPowerShow= arrPower.slice(1440*(hourNum-1),1440*hourNum);
		arrRepowerShow= arrRepower.slice(1440*(hourNum-1),1440*hourNum);
		for (var i=0;i<1440;i++) {
			arrDifferShow[i]=(arrRepowerShow[i]-arrPowerShow[i]).toFixed(1);
		}
		
//		console.log('arrPowerShow:');
//		console.log(arrPowerShow);
//		console.log('arrRepowerShow:');
//		console.log(arrRepowerShow);
		
	};	



// 4.画图
		
	document.getElementById('datatoChart').onclick=function(){
	
	
	    // 基于准备好的dom， echarts.init（）方法初始化echarts实例
		var myChart = echarts.init(document.getElementById('main'));

	    var option = {
	//标题
	        title: {
	        	textStyle:{
	        		color:"#ffffff"
	        	},
	            text: '储能系统效果展示'
	        },
	        color: ['#53ff1a','#00ffff','#ff6666'],
	//提示框组件        
	        tooltip: { 
	        	trigger:'axis',//触发方式
	        	axisPointer: {
	                type: 'cross'
	            }
	        },
	//坐标轴指示器        
	        axisPointer: {
	            label: {
	                backgroundColor: '#777'
	            }
	        },    
	//图例        
	        legend: { //  series里面有name值该处可省略
	            //data:['有功曲线']
	            textStyle:{
	        		color:"#ffffff"
	        	}
	        },
	//工具箱
	        toolbox: {
	            feature: {
	                saveAsImage: {
	                    pixelRatio:2,
	                    name:hourSelect,
	                    backgroundColor:'#003166'
	                }
	            }
	        },
	//图表边距        
	        grid:{
	        	left:'3%',
	        	right:'3%',
	        	bottom:'7%'
	        },
	//X轴        
	        xAxis: {
	        	axisLine:{
	        		lineStyle:{
	        			color:"#ffffff"
	        		}
	        	},
	        	axisLabel:{ //刻度
	        		color:"#ffffff",
	        		interval:59,
	        		showMaxLabel: true
	        	},
				data:arrxAxis
	        },
	//Y轴        
	        yAxis: {
	        	axisLine:{
	        		lineStyle:{
	        			color:"#ffffff"
	        		}
	        	},	        	
				axisLabel:{
	        		color:"#ffffff"
	        	},
	        	splitLine:{
	        		lineStyle:{
	        			color:"#47476b"
	        		}
	        	}
	        	
	        },
	//滑块和放大缩小        
	        dataZoom: [
	            {   // 这个dataZoom组件，默认控制x轴。鼠标滚动变化
	                type: 'inside', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
	                start: 0,      // 左边在 10% 的位置。
	                end: 100         // 右边在 60% 的位置。
	            },
	        ],
	        
	        
	//数据        
	        series: [
	        {
	            name: '储能系统吸收有功功率曲线',
	            type: 'line',
	            data:arrPowerShow,
	            lineStyle:{
	            	width:0.9
	            }
	        },
	        {
	        	name: '交流线路治理后有功功率曲线',
	            type: 'line',
	            data:arrRepowerShow,
	            lineStyle:{
	            	width:0.9
	            }
	        },
	        {
	        	name: '交流线路原始有功功率曲线',
	            type: 'line',
	            data:arrDifferShow,
	            lineStyle:{
	            	width:1.5,
	            	type:'dotted'
	            }
	        }
	        ]
	    };
	    // setOption（）方法生成图表，使用刚指定的配置项和数据显示图表。
	    myChart.setOption(option);
	
	};

};
