/* 
	eamil:1259821073@qq.com
	data:2018-11-16
*/
function Wipe(obj){
	this.cas = document.querySelector("#"+ obj.id);
	this.conId = obj.id;
	this.context = this.cas.getContext("2d");
	this.moveX = 0;
	this.moveY = 0;
	this.isMouseDown = false;
	this.device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));	
	this.backImgUrl = obj.backImgUrl;
	this.imgUrl = obj.imgUrl;
	this.coverType = obj.coverType;
	this.color = obj.color || "#666";
	this._w = obj.width || this.cas.width;
	this._h = obj.height || this.cas.height;
	this.radius = obj.radius || 20;
	this.transpercent = obj.percent || 50;
	this.callback = obj.callback;
	this.drawMask();
	this.addEvent();
	this.castest = obj.castest;
	if (this.castest) {
		this.test();
	}
	if (this.backImgUrl) {
		this.backImg();
		// this.test();
	}
}
//drawT()画点和画线的函数
//参数:如果只有两个参数,函数功能画圆,x1,y1即圆的中心坐标
//如果传递四个参数,函数功能画线,x1,y1为起始坐标,x2,y2为结束坐标
Wipe.prototype.drawT = function(x1,y1,x2,y2){
	if (arguments.length === 2) {
		this.context.save();
		this.context.beginPath();
		this.context.arc(x1,y1,this.radius,0,2*Math.PI);
		this.context.fillStyle = "rgb(250,0,0)";
		this.context.fill();
		this.context.restore();
	}else if (arguments.length === 4){
		this.context.save();
		this.context.lineCap = "round";
		this.context.beginPath();
		this.context.moveTo(x1,y1);
		this.context.lineTo(x2,y2);
		this.context.lineWidth=this.radius*2;
		this.context.stroke();
		this.context.restore();
	}else{
		return false;
	}
};
Wipe.prototype.clearRect = function(){
	this.context.clearRect(0,0,this._w,this._h);
};
Wipe.prototype.getTransparencyPercent = function(){
	var _t = 0;
	var imgData = this.context.getImageData(0,0,this._w,this._h);
	for(i=0;i<this._h;i++){
		for(j=0;j < this._w;j++){
			var Alpha = ((this._w*i)+j)*4+3;
			if (imgData.data[Alpha] ===0) {
				_t++;
			}
		}
	}
	this.percent = ( _t / ( this._w * this._h ) ) * 100;
	console.log( Math.ceil(this.percent) + "%");
	return this.percent.toFixed(2);
};
Wipe.prototype.drawMask=function(){
	if (this.coverType === "color" || this.coverType === "") {
		this.context.fillStyle = this.color;
		this.context.fillRect(0,0,this._w,this._h);
		this.context.globalCompositeOperation = "destination-out";
	}else if ( this.coverType === "image" ){
		var that = this;
		var img = new Image();
		img.src = this.imgUrl;
		img.onload=function(){
			that.context.drawImage(img,0,0,that._w,that._h);
			that.context.globalCompositeOperation = "destination-out";
		};
	}
};
Wipe.prototype.addEvent = function(){
	var clickEvtName = this.device ? "touchstart" : "mousedown";
	var moveEvtName = this.device ? "touchmove" : "mousemove";
	var endEvtName = this.device ? "touchend" : "mouseup";
	var that = this;
	var allLeft;
	var allTop;
	var currentObj;
	var scrollTop;
	var scrollLeft;
	this.cas.addEventListener(clickEvtName,function(evt){
		allLeft = that.cas.offsetLeft;
		allTop = that.cas.offsetTop;
		currentObj = that.cas;
		while(currentObj = currentObj.offsetParent){
			allLeft += currentObj.offsetLeft;
			allTop += currentObj.offsetTop;
		}
		scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		var event = evt || window.event;
		that.moveX = that.device ?  event.touches[0].clientX - allLeft + scrollLeft : event.clientX - allLeft + scrollLeft;
		that.moveY = that.device ?  event.touches[0].clientY - allTop + scrollTop : event.clientY - allTop + scrollTop;
		that.drawT(that.moveX,that.moveY);
		that.isMouseDown = true;
	});
	this.cas.addEventListener(moveEvtName,function(evt){
		scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		if( that.isMouseDown ){
			var event = evt || window.event;
			event.preventDefault();
			var x2 = that.device ?  event.touches[0].clientX - allLeft + scrollLeft: event.clientX - allLeft + scrollLeft;
			var y2 = that.device ?  event.touches[0].clientY - allTop + scrollTop: event.clientY - allTop + scrollTop;
			that.drawT(that.moveX,that.moveY,x2,y2);
			that.moveX = x2;
			that.moveY = y2;
		}else{
			return false;
		}
	},false);
	this.cas.addEventListener(endEvtName,function(evt){
		// 还原isMouseDown为false
		that.isMouseDown = false;
		// 借用外部的处理函数
		setTimeout(function(){
			var percent = that.getTransparencyPercent();
			// 调用同名的全剧函数
			that.callback.call(null,percent,that.transpercent);
			// 当透明面积超过用户指定的透明面积
			if ( percent > that.transpercent) {
				that.clearRect();
			}
		},500);
	},false);
};
Wipe.prototype.backImg = function(){
	 this.cas.style.cssText="background:url("+this.backImgUrl+") center 0 no-repeat; background-size: cover;";
};
Wipe.prototype.test = function(){
		this.context.save();
		this.context.font = " 100px 黑体";
		this.context.textAlign = "center";
		this.context.fillText(this.castest,200,400);
		this.context.restore();
};