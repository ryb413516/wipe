var cs = document.querySelector("#cas");
var context = cas.getContext("2d");
var _w = cas.width,_h = cas.height;
var radius = 20;//涂抹的半径
var moveX;
var moveY;
var isMouseDown = false;//表示鼠标的状态，是否按下，默认为未按下false，按下true
//生成画布上的遮罩,默认颜色为#666
function drawMask(context){
	context.fillStyle = "#666";
	context.fillRect(0,0,_w,_h);
	context.globalCompositeOperation = "destination-out";
}

//在画布上画白净为30的圆
function drawPoint(context,moveX,moveY){
	context.save();
	context.beginPath();
	context.arc(moveX,moveY,radius,0,2*Math.PI);
	context.fillStyle = "rgb(250,0,0)";
	context.fill();
	context.restore();
}
function drawLine(context,x1,y1,x2,y2){
	context.save();
	context.lineCap = "round";
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.lineWidth=radius*2;
	context.stroke();
	context.restore();
}
//在canvas画布上监听自定义事件"mousedown",调用drawPoint函数
cas.addEventListener("mousedown",function(evt){
	var event = evt || window.event;
	//获取鼠标在视口的坐标，传递参数到drawPoint
	moveX = event.clientX;
	moveY = event.clientY;
	drawPoint(context,moveX,moveY);
	isMouseDown = true;
},false);
cas.addEventListener("mousemove",function(evt){
	if(isMouseDown === true){
		var event = evt || window.event;
		var x2 = event.clientX;
		var y2 = event.clientY;
		drawLine(context,moveX,moveY,x2,y2);
		//每次的结束点变成下一次划线的开始点
		moveX = x2;
		moveY = y2;
	}else{
		return false;
	}
},false);
function getTransparencyPercent(context){
	var _t = 0;
	var imgData = context.getImageData(0,0,_w,_h);
	for(i=0;i<_h;i++){
		for(j=0;j<_w;j++){
			var Alpha = ((_w*i)+j)*4+3;//Alpha在数组中的位置
			if (imgData.data[Alpha] ===0) {
				_t++;
			}
		}
	}
	var percent = (_t/(_w*_h))*100;
	console.log( Math.ceil(percent) + "%");
	return (percent).toFixed(2);
	// return Math.ceil(percent);
}
cas.addEventListener("mouseup",function(evt){
	isMouseDown = false;
	if ( getTransparencyPercent(context) > 50) {
		alert("超过了50%的面积");
		clearRect(context);
	}
},false);
function clearRect(context){
	context.clearRect(0,0,_w,_h);
}
//增加监听"mousemove",调用drawPoint函数
window.onload = function(){
	drawMask(context);
	// drawPoint(context);
};