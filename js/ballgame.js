// JavaScript Document
$(function(){
	var ctx = null;
	window.requestAnimationFrame = window.requestAnimationFrame|| window.mozRequestAnimationFrame || window.webkitRuestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
	var Game =  {
		canvas : $('#canvas').get(0),
		setup : function(){
			//console.log(!!this.canvas.getContext)
			if(!!this.canvas.getContext){
				ctx = this.canvas.getContext('2d');
				this.width = this.canvas.width;
				this.height = this.canvas.height;
				this.init();
				Ctrl.init();				
			}
		},
		animate : function(){
			Game.play = window.requestAnimationFrame(Game.animate);
			Game.draw();
		},
		init : function(){
			Background.init();
			Ball.init();
			Paddle.init();
			Bricks.init();
			this.animate();
		},
		draw : function(){
			ctx.clearRect(0,0,this.width,this.height);
			Background.draw();
			Ball.draw();
			Paddle.draw();
			Bricks.draw();
		}
	};
	var Background = {			//背景
		init : function(){
			this.ready = false;
			this.img = new Image();
			this.img.src = 'image/background.jpg';
			this.img.onload = function(){
				Background.ready = true;
			};			
			//console.log(1)
			//console.log(this.img.src);
		},
		draw : function(){
			if(this.ready){
				ctx.drawImage(this.img,0,0);
			}
		}
	};
	var Bricks = {				//砖块
		gap : 2,				//间隙
		col : 5,				//5列
		w : 80,					//宽
		h : 15,					//高
		init : function(){
			this.row = 3;
			this.total = 0;
			this.count = [this.row];
			//console.log(this.count);
			//alert(this.count)
			for(var i = this.row; i--;){		//这样写默认为大于等于0
				//console.log(i)
				this.count[i] = [this.col]
				//console.log(this.count[i])
			}
			//alert(this.count)			打印出三个5的数组
			
		},
		
		x : function(row){
			return (this.w*row) + (this.gap*row)
		},
		y : function(col){
			return (col*this.h) + (col*this.gap)
		},
		gradient : function(row){			
			switch(row){
				case 0 :			//紫色
					return this.gradientPurple?this.gradientPurple: this.gradientPurple = this.makeGradient(row,'#bd06f9','#9604c7');
					break;
				case 1 :			//红色
					return this.gradientRed?this.gradientRed: this.gradientRed = this.makeGradient(row,'#f9064a','#c7043b');
					break;
				case 2 : 			//绿色
					return this.gradientGreen?this.gradientGreen: this.gradientGreen =this.makeGradient(row,'#05fa15','#04c711');
					break;
				default:			//橙色
					return this.gradientOrange?this.gradientOrange: this.gradientOrange = this.makeGradient(row,'#faa105','#c77f04');
					break;
			}
		},
		draw : function(){
			var i,j;
			for(i = this.row; i--;){
				for(j = this.col;j--;){
					if(this.count[i][j] !== false){
						if(Ball.x >= this.x(j) && Ball.x <= (this.x(j) + this.w) && Ball.y >= this.y(i) && Ball.y <= (this.y(i) + this.h)){
							this.collied(i,j);
							continue;			//跳出当前循环，执行下面的循环
						}
						//debugger;
						//console.log(this)
						//console.log(i)
						ctx.fillStyle = this.gradient(i);   //填充颜色
						
						ctx.fillRect(this.x(j),this.y(i),this.w,this.h);
						//console.log(this.gradient(i))
					}
				}
			}
		},
		makeGradient : function(row,color1,color2){		//createLinearGradient()	定义从左到右渐变
			var y = this.y(row);
			var grad = ctx.createLinearGradient(0,y,0,y + this.h);
			grad.addColorStop(0,color1);					//addColorStop() 方法来改变渐变
			grad.addColorStop(1,color2);
			return grad;
		},
		collied : function(i,j){
			this.count[i][j] = false;
			Ball.sy = -Ball.sy;
		}
		
	};
	
	var Ball = {				//球
		r : 10,
		init : function(){
			this.x = 120,
			this.y = 120,
			this.sx = 2,
			this.sy = -2
		},
		draw : function(){
			this.edges();  		//边框
			this.collied();		//碰撞
			this.move();		//移动
			ctx.beginPath();	//画圆
			ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
			ctx.fillStyle = "#333";
			ctx.fill();
		},
		/*gradient : function(){
			if(this.gradientBall){
				return this.gradientBall;
			};
			this.gradientBall = ctx.createLinearGradient(110,110,130,130);
			this.gradientBall.addColorStop(0,'#fff');
			this.gradientBall.addColorStop(1,'#000');
			return this.gradientBall;
		},*/
		move : function(){
			this.x += this.sx;
			this.y += this.sy;
		},
		edges : function(){
			//console.log(1)
			//console.log(this.y)
			if(this.y < 1){
				this.y = 1;
				this.sy = -this.sy;
			}else if(this.y > Game.height){
				this.y = Game.height;
				this.sy = -this.sy;
				//this.y = this.x = 1000;
				//this.sy = this.sx = 0;
				//screen.gameover();
				$('#canvas').on('click',function(){
					//Game.restartGame();
				})
				return;
			}
			if(this.x < 1){
				this.x = 1;
				this.sx = -this.sx;
			}else if(this.x > Game.width){
				this.x = Game.width - 1;
				this.sx = -this.sx;
			}
		},
		collied : function(){
			//=console.log(this.x)
			if(this.x >= Paddle.x && this.x <= Paddle.x + Paddle.w && this.y >= Paddle.y && this.y <= Paddle.x + Paddle.h){		//这个有问题
				this.sy = -this.sy;
				//小球撞击球拍之后，修改小球在偏向弹回时的X轴坐标,这个公式需要记住
				this.sx = 7 * (this.x - (Paddle.x + Paddle.w/2))/Paddle.w 
				//console.log(this.sx)
				console.log(this.x)
				console.log(Paddle.x)
			}
		}
	};
	var Paddle = {				//球拍
		w : 90,
		h : 20,
		r : 9,
		init : function(){
			this.x = 100;
			this.y = 210;
			this.speed = 4;
		},
		draw : function(){
			this.move();
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.arcTo(this.x + this.w,this.y, this.x + this.w,this.y+this.r,this.r);		//起点和终点的x坐标保持一致
			ctx.lineTo(this.x+this.w,this.y+this.h-this.r);
			ctx.arcTo(this.x+this.w,this.y+this.h,this.x+this.w-this.r,this.y+this.h,this.r);
			ctx.lineTo(this.x+this.r,this.y+this.h);
			ctx.arcTo(this.x,this.y+this.h,this.x,this.y+this.h-this.r,this.r);
			ctx.lineTo(this.x,this.y+this.r);
			ctx.arcTo(this.x,this.y,this.x+this.r,this.y,this.r);
			ctx.closePath();
			ctx.fillStyle = this.gradient();
			ctx.fill();
		},
		move : function(){			//让球拍动起来			
			/*if(this.x > this.w && this.x < Game.width-this.w){
				this.x += this.speed;				
			};*/
			if(Ctrl.left == true && this.x > 0){
				this.x -= this.speed;
				console.log(this.x)
			}else if(Ctrl.right == true && this.x < Game.width - this.w){
				this.x += this.speed;
				console.log(this.x)
			}
		},
		gradient : function(){
			if(this.gradientCache){
				return this.gradientCache
			};
			this.gradientCache = ctx.createLinearGradient(this.x,this.y,this.x,this.y+20);
			this.gradientCache.addColorStop(0,'#eee');
			this.gradientCache.addColorStop(1,'#999');
			return this.gradientCache;
		}
	};
	var Ctrl = {
		init : function(){
			$(window).on('keydown',function(e){
				//console.log(this)
				Ctrl.keyDown(e);
			});
			$(window).on('keyup',function(e){
				Ctrl.keyUp(e);
			});
		},
		keyDown : function(e){
			//console.log(e.keyCode)
			switch(e.keyCode){
				case 37:			//左光标键
				Ctrl.left = true;
				break;
				case 39:			//右光标键
				Ctrl.right = true;
				break;
				default:
				return false;
			}
		},
		keyUp : function(e){
			//console.log(e.keyCode)
			switch(e.keyCode){
				case 37:
				Ctrl.left = false;
				break;
				case 39:
				Ctrl.right = false;
				break;
				default:
				return false;
			}
		}
	};
	window.onload = function(){
		Game.setup();
	};
	
	
	/*function requestAnim(){
		
		return window.requestAnimationFrame|| window.mozRequestAnimationFrame || window.webkitRuestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback){
			setTimeout(callback,1000/60);
		}
	}*/
	
	
})