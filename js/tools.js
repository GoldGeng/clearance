//事件绑定
function addEvent(elem , type , handle) {
	if (elem.addEventListener) {
		elem.addEventListener(type , handle , false);
	}else if(elem.attachEvent){
		elem.attachEvent('on' + type,function () {
			handle.call(elem);
		})
	}else{
		elem['on' + type] = handle;
	}
}
//事件解绑
function cancelEvent(elem , type , handle) {
	if (elem.removeEventListener) {
		elem.removeEventListener(type , handle , false);
	}else if(elem.detachEvent){
		elem.detachEvent('on' + type,function () {
			handle.call(elem);
		})
	}else{
		elem['on' + type] = false;
	}
}