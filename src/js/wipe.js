var cas = document.querySelector("#cas");
var context = cas.getContext("2d");
var _w = cas.width,_h = cas.height;
var radius = 20;//涂抹的半径
var moveX;
var moveY;
var isMouseDown = false;
//表示鼠标的状态，是否按下，默认为未按下false，按下true

//device保存设备类型,如果是移动端则为true
var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
// var device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
console.log(device);
console.log(navigator.userAgent);
var clickEvtName = device ? "touchstart" : "mousedown";
var moveEvtName = device ? "touchmove" : "mousemove";
var endEvtName = device ? "touchend" : "mouseup";

//生成画布上的遮罩,默认颜色为#666
function drawMask(context){
	context.fillStyle = "#666";
	context.fillRect(0,0,_w,_h);
	context.globalCompositeOperation = "destination-out";
}

//在画布上画白净为30的圆
function drawPoint(context,moveX,moveY){
	console.log("传递参数的个数:" +arguments.length);
	context.save();
	context.beginPath();
	context.arc(moveX,moveY,radius,0,2*Math.PI);
	context.fillStyle = "rgb(250,0,0)";
	context.fill();
	context.restore();
}
// 画线
function drawLine(context,x1,y1,x2,y2){
	console.log("传递参数的个数:" +arguments.length);
	context.save();
	context.lineCap = "round";
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.lineWidth=radius*2;
	context.stroke();
	context.restore();
}
//透明值
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
//清楚涂抹
function clearRect(context){
	context.clearRect(0,0,_w,_h);
}
function drawT(context,x1,y1,x2,y2){
	if (arguments.length === 3) {
		// 调用的是画点功能
		context.save();
		context.beginPath();
		context.arc(x1,y1,radius,0,2*Math.PI);
		context.fillStyle = "rgb(250,0,0)";
		context.fill();
		context.restore();
	}else if (arguments.length === 5){
		console.log("传递参数的个数:" +arguments.length);
		context.save();
		context.lineCap = "round";
		context.beginPath();
		context.moveTo(x1,y1);
		context.lineTo(x2,y2);
		context.lineWidth=radius*2;
		context.stroke();
		context.restore();
	}else{
		return false;
	}
}
//点击事件
cas.addEventListener(clickEvtName,function(evt){
	var event = evt || window.event;
	// 获取手指在视口的坐标，传递参数到drawPoint
	moveX = device ?  event.touches[0].clientX : event.clientX;
	moveY = device ?  event.touches[0].clientY : event.clientY;
	drawT(context,moveX,moveY);
	isMouseDown = true;
},false);
//移动事件
cas.addEventListener(moveEvtName,function(evt){
	if( isMouseDown){
		var event = evt || window.event;
		event.preventDefault();
		x2 = device ? event.touches[0].clientX : event.clientX;
		y2 = device ? event.touches[0].clientY : event.clientY;
		drawT(context,moveX,moveY,x2,y2);
		moveX = x2;
		moveY = y2;
	}else{
		return false;
	}
},false);
//抬起事件
cas.addEventListener(endEvtName,function(evt){
	isMouseDown = false;
	if ( getTransparencyPercent(context) > 50) {
		alert("超过了50%的面积");
		clearRect(context);
	}
},false);
//增加监听"mousemove",调用drawPoint函数
window.onload = function(){
	drawMask(context);
	// drawPoint(context);
};
/* 博大大 */