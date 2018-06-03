
var gamePage = document.getElementsByClassName('game-page')[0];
var gameLevel = document.getElementsByTagName('li');
var input = document.getElementsByTagName('input');
var newGame = document.getElementsByTagName('span')[0];
var timer;
var arrBoom = [];
var indexBoom = [];//布置雷的索引
var timerFlag = true;//计时器标记
var levelFlag = 0;
var arrObj = {};
var arrNum = {};
var rowsL = 9;
var colsL = 9;

init();
//界面初始化
function init() {
	gameLevel[0].style.backgroundColor = 'orange';
	initGame(0 , 9 , 9 , 41 , 10);
	selectLevels();
}
//新游戏
newGame.onclick = function () {
	//获得游戏难度 levelFlag
	switch(levelFlag){
		case 0:
			initGame(0 , 9 , 9 , 41 , 10);
			break;
		case 1:
			initGame(1 , 16 , 16 , 26 , 70);
			break;
		case 2:
			initGame(2 , 16 , 30 , 26 , 190);
			break;
	}
	//重新计时
	input[0].value = 0;
	input[1].value = 0;
	clearInterval(timer)
}
//选择游戏难度
function selectLevels() {
	for (var i = 0; i < 3; i++) {
		gameLevel[i].onclick = (function (i) {
			 return function () {
			 	for (var j = 0; j < 3; j++) {
					gameLevel[j].style.backgroundColor = '#FFB';
				}
					gameLevel[i].style.backgroundColor = 'orange';
			
				switch(i){
					case 0:
						initGame(0 , 9 , 9 , 41 , 10);
						break;
					case 1:
						initGame(1 , 16 , 16 , 26 , 70);
						break;
					case 2:
						initGame(2 , 16 , 30 , 26 , 190);
						break;
				}
			 }
		}(i));
	}
}
//游戏初始化
function initGame(level , rows , cols , width , numBoom) {
	levelFlag = level;
	arrBoom = drawMap(rows , cols ,width , numBoom);
	input[2].value = arrBoom[1];
	arrNum = arrBoom[0];
	indexBoom = arrBoom[3];
	rowsL = rows;
	colsL = cols;
	gamePage.addEventListener('mousedown' , gameClick , false);
}
//右击插小旗

/* 思路：1.点击的是0
		 2.点击位置每个方向是不是0？是不是打开了？（不是0 直接打开）
		 3.没打开的 0  创建一个数组[] 记录没打开0的位置
		 4.
*/ 
//扩散函数
function diffuse(index) {
	var arr = [];
	var x = Math.floor(index / colsL);
	var y = Math.floor(index % colsL);
	if (arrNum[x][y] == 0) {
		arr = aroundPosition(x , y);
	}
	for (var i = 0; i < arr.length; i++) {
		if(arr[i][0] >= 0 && arr[i][0] < rowsL){
			if (arr[i][1] >= 0 && arr[i][1] < colsL) {
				if (gamePage.children[arr[i][0] * colsL + arr[i][1]].className != 'fdiv') {
					gamePage.children[arr[i][0] * colsL + arr[i][1]].className = 'fdiv';
					diffuse(arr[i][0] * colsL + arr[i][1]);
				}
			}
		}
	}	

}
//周边数函数
function aroundPosition(x , y) {
	var posArr = [];
	var posArr = [[x - 1 , y - 1],[x, y - 1],[x + 1 , y - 1],[x +1 , y]
				,[x + 1 , y + 1],[x , y + 1],[x -1 , y + 1],[x -1 , y]];
	return posArr;
}

//取消默认右击事件
document.addEventListener('contextmenu', function (e) {
		e.preventDefault();
}, false);

//点击处理函数
var numWin = 0;//判断游戏胜利

function gameClick(e) {
	var event = e || window.event;
	var target = event.target || event.srcElement;
	
	//开始计时
	if (timerFlag) {
		startTimer();
		timerFlag = false;
	}
	if (e.button == 0) {

	    if (target.innerHTML == 9) {
			target.className = 'boom';
			clearInterval(timer);
			gameOver();
			alert('游戏结束');
			timerFlag = true;
			gamePage.onclick = false;
		}else if(target == gamePage){

		}else{
			target.className = 'fdiv';
			//事件源的索引 
			//console.log(Array.prototype.slice.call(target.parentNode.children).indexOf(target));
			var indexTarget = Array.prototype.slice.call(target.parentNode.children).indexOf(target);
			diffuse(indexTarget);
		}
	}else if(e.button == 2){
		if (target.className != 'fdiv' && target.className != 'flag') {
			if (input[2].value > 0) {
				var indexTarget = Array.prototype.slice.call(target.parentNode.children).indexOf(target);
				target.className = 'flag';
				input[2].value -= 1;

				numWin = addNum(numWin , indexTarget);
				console.log (numWin);
			}else if (input[2].value == 0) {}{
				gameWin(numWin);

			}
		}else if(target.className == 'flag'){
			var indexTarget = Array.prototype.slice.call(target.parentNode.children).indexOf(target);
			target.className = 'none';
			input[2].value = +input[2].value + 1;

			numWin = plusNum(numWin , indexTarget);
			console.log (numWin);
		}		
	}
}
//判断胜利 ：插旗子位置正好都是雷的位置  游戏胜利 旗子数为0
function addNum(num , index) {
	for (var i = 0; i < indexBoom.length; i++) {
		if (indexBoom[i] == index) {
			num ++;
		}
	}
	return num;
}
function plusNum(num , index) {
	for (var i = 0; i < indexBoom.length; i++) {
		if (indexBoom[i] == index) {
			num --;
		}
	}
	return num;
}
function gameWin(num) {
	if (num == indexBoom.length) {
		alert('棒棒哒');
		gameOver();
	}
}


//计时
function startTimer() {
	timer = setInterval(function () {
		if (input[1].value >= 59) {
			input[0].value = + input[0].value + 1;
			input[1].value = 0;
		}
		input[1].value = + input[1].value + 1;
	},1000);
}
//绘制地图
function drawMap(rows, cols ,sqWidth , num) {
	var  arr = [];
	var  arrObj = {};
	var boomIndex = [];
	var html = '';
	for (var i = 0; i < rows; i++) {
		arr[i] = new Array();
		for (var j = 0; j < cols; j++) {
			 html += "<div></div>"; 
			  arr[i][j] = 0;
			  arrObj[i + ',' + j] = null;
		}
	}

		gamePage.style.width = (sqWidth + 1) * cols +"px";
		gamePage.style.height = (sqWidth + 1)* rows +"px";
		gamePage.innerHTML = html;

		var len = gamePage.children.length;
		for (var i = 0; i < len; i++) {
			gamePage.children[i].style.width = sqWidth +'px';
			gamePage.children[i].style.height =  sqWidth +'px';
			gamePage.children[i].style.lineHeight = sqWidth +'px';
		}
		//布雷
		boomIndex = creatBoom(rows, cols ,num);
		for (var i = 0; i < boomIndex.length; i++) {
		arr[Math.floor(boomIndex[i] / cols)][Math.floor(boomIndex[i] % cols)] = 9;	
		}
		//提示雷数
		creatNum(rows , cols , arr);

		 for (var i = 0; i < rows; i++) {
		 	for (var j = 0; j < cols; j++) {
		 		gamePage.children[i * cols + j].innerHTML = arr[i][j];
		 		arrObj[i + ',' + j] = arr[i][j];
		 	}
		 }
		
		
	return [arr , num , arrObj , boomIndex];
}
//布雷

function creatBoom(rows, cols ,num) {
	var boomIndex = [];
		for (var i = 0; i < rows * cols; i++) {
			boomIndex[i] = i;
		}
		boomIndex.sort(function (a , b) {
			return Math.random() - 0.5;
		});
	return boomIndex.splice(0,num);
}

//布提示数
function creatNum(rows , cols , arr) {
	var num = 0;
	for (var i = 0; i < rows; i++) {
	 	for (var j = 0; j < cols; j++) {
	 			//左
	 			if((j - 1) >= 0){
	 			 	if(arr[i][j - 1] == 9){
	 			 		num ++;
	 			 	}
	 			}
	 			//右
	 			if((j + 1) < cols){
	 			 	if(arr[i][j + 1] == 9){
	 			 		num ++;
	 			 	}
	 			}
	 			//下
	 			if((i + 1) < rows){
	 			 	if(arr[i + 1][j] == 9){
	 			 		num ++;
	 			 	}
	 			}
	 			//上
	 			if((i - 1) >= 0){
	 			 	if(arr[i - 1][j] == 9){
	 			 		num ++;
	 			 	}
	 			}
	 			//左上
	 			if((i - 1) >= 0 && (j - 1) >= 0){
	 			 	if(arr[i - 1][j - 1] == 9){
	 			 		num ++;
	 			 	}
	 			}
	 			//左下
	 			if((i - 1) >= 0 && (j + 1) < cols){
	 			 	if(arr[i - 1][j + 1] == 9){
	 			 		num ++;
	 			 	}
	 			}
	 			//右上
	 			if((i + 1) < rows && (j - 1) >= 0){
	 			 	if(arr[i + 1][j - 1] == 9){
	 			 		num ++;
	 			 	}					
	 			}
	 			//右下
	 			if((i + 1) < rows && (j + 1) < cols){
	 			 	if(arr[i + 1][j + 1] == 9){
	 			 		num ++;
	 			 	}
	 			}
		 	
		 	if(arr[i][j] != 9){	
		 		arr[i][j] = num;
	 		}
	 		num = 0;
		}
	 }
	return arr;
}


//显示结果
function gameOver() {
	var len = gamePage.children.length;
	for (var i = 0; i < len; i++) {
		if (gamePage.children[i].innerHTML == 9) {
			gamePage.children[i].className = 'boom';
		}else{
			gamePage.children[i].className = 'fdiv';
		}
	}
}