
var LifeState = new State( {
	"onEnter" : function() {
		var lifeView = new LifeView();
		window.AppFacade.setCurrentView(lifeView);
	},
	"onExit" : function() {
		
	}
} );

var LifeView = function(){
	this.init();
}
LifeView.prototype = {
	animateIn : function() {
		AnimationHandler.animateIn();
	},
	init : function() {
		var self = this;
		this.el = $('#scene-life');
		
		AnimationHandler.initialize('#scene-life-content');
		
		this.initQuestionHint();
		this.initAnswerTooltip();
		
		

		var lifeCenter = Raphael("life-center", 200, 200);
		lifeCenter.customAttributes.arc = function (xloc, yloc,start, value, total, R) {
		    	var alpha = 360 / total * start,
		    	beta = 360/total * value,
		        a = (60 - alpha) * Math.PI / 180,
		        b = (60 - beta - alpha ) * Math.PI / 180,
		        xa = xloc + R * Math.cos(a),
		        ya = xloc - R * Math.sin(a),
		        xb = xloc + R * Math.cos(b),
		        yb = yloc - R * Math.sin(b),
		        path;
		    if (total == value) {
		        path = [
		            ["M", xloc, yloc - R],
		            ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
		        ];
		    } else {
		        path = [
		            ["M", xa, ya],
		            ["A", R, R, 0, +(beta > 180), 1, xb, yb]
		        ];
		    }
		    return {
		        path: path
		    };
		};

		
		var stressHigh,stressMedium,stressLow,stressPin,stressPinRoot,
		stressHighText,stressMediumText,stressLowText;
		lifeCenter.path().attr({
		    "fill": "#FFF",
		    arc: [100, 100, -2, 3, 6, 90]
		});
		lifeCenter.path().attr({
		    "fill": "#fad949",
		    "stroke":"#e4600d",
		    "stroke-width": 20,
		    arc: [100, 100, 1, 3, 6, 90]
		});
		lifeCenter.path("M0 102L200 102").attr({
			"stroke":"#e4600d",
			"stroke-width": 4
		});
		
        
		stressHigh = lifeCenter.path().attr({
		    "stroke": "#da442c",
		    "stroke-width": 30,
		    "cursor":"pointer",
		    arc: [100, 100, -2, 1, 6, 85]
		}).click(function () {
            stressPin.animate({
            	transform:"r-60 100 100"
            }, 500, 'back-out')
            .attr({
            	"stroke":"#e4600d",
            	"stroke-dasharray":""
            });
            
            stressPinRoot.attr({
            	"fill":"#e4600d"
            });
         });
         
        
        
		stressMedium = lifeCenter.path().attr({
		    "stroke": "#248fe0",
		    "stroke-width": 30,
		    "cursor":"pointer",
		    arc: [100, 100, -1, 1, 6, 85]
		}).click(function () {
            stressPin.animate({
            	transform:""
            }, 500, 'back-out')
            .attr({
	            
            	"stroke":"#e4600d",
            	"stroke-dasharray":""
            });
            
            stressPinRoot.attr({
            	"fill":"#e4600d"
            });
         });
		stressLow = lifeCenter.path().attr({
		    "stroke": "#8cd03c",
		    "stroke-width": 30,
		    "cursor":"pointer",
		    arc: [100, 100, 0, 1, 6, 85]
		}).click(function () {
            stressPin.animate({
            	"transform":"r60 100 100"
            }, 500, 'back-out')
            .attr({
            	"stroke":"#e4600d",
            	"stroke-dasharray":"",
            });
            
            stressPinRoot.attr({
            	"fill":"#e4600d"
            });
         });
		
		
		stressHighText = lifeCenter.text(0,38,"压力山大")
        .attr({
	        "font-size":"10px",
	        "fill":"#FFF",
	        "cursor":"pointer",
	        "transform":"r-60 0 38"
        }).click(function () {
            stressPin.animate({
            	transform:"r-60 100 100"
            }, 500, 'back-out')
            .attr({
            	"stroke":"#e4600d",
            	"stroke-dasharray":""
            });
            
            stressPinRoot.attr({
            	"fill":"#e4600d"
            });
         });;
        stressMediumText = lifeCenter.text(100,10,"压力适中")
        .attr({
	        "font-size":"10px",
	        "cursor":"pointer",
	        "fill":"#FFF"
        }).click(function () {
            stressPin.animate({
            	transform:""
            }, 500, 'back-out')
            .attr({
	            
            	"stroke":"#e4600d",
            	"stroke-dasharray":""
            });
            
            stressPinRoot.attr({
            	"fill":"#e4600d"
            });
         });;
        stressLowText = lifeCenter.text(200,38,"轻轻松松")
        .attr({
	        "font-size":"10px",
	        "cursor":"pointer",
	        "fill":"#fff",
	        "transform":"r60 200 38"
        }).click(function () {
            stressPin.animate({
            	"transform":"r60 100 100"
            }, 500, 'back-out')
            .attr({
            	"stroke":"#e4600d",
            	"stroke-dasharray":"",
            });
            
            stressPinRoot.attr({
            	"fill":"#e4600d"
            });
         });;
        
		stressPin = lifeCenter.path("M100 100L100 20").attr({
			 "stroke": "#ccc",
			 "stroke-width": 5,
			 "stroke-dasharray":"-",
			 "arrow-end":"classic"
		});
		stressPinRoot = lifeCenter.circle(100,100,6).attr({
			"fill": "#ccc",
			"stroke-width":0
		});
		
		
		var linesEl = $('#life-lines');
		var linesPaper = Raphael("life-lines", linesEl.width(), linesEl.height());
		var linesStartX = linesEl.width() / 2;
		var linesStartY = linesEl.height() / 2;
		var lines = [];
		var stepX = 1;
		var stepY = 1;
		
		
		var linesCount = $('.life-icon').size();
		
		for ( var i = 0 ; i < linesCount; i++ ) {
			var line = linesPaper.path()
			.attr({
			"stroke":"#e4600d",
			"stroke-width":4,
			"stroke-linejoin":"round"
			});
			lines.push(line);
		}
		
		$('.life-icon').click(function(e){
			
			var icon = $(this);
			var linesEndX = $(this).position().left;
			var linesEndY = $(this).position().top;
			var line = lines[icon.index()];
			
			
			icon.toggleClass('selected');
			//set life type text
			var workIconCount = $('.life-work.selected').size();
			var playIconCount = $('.life-play.selected').size();
			
			if ( workIconCount > 0 || playIconCount > 0 ) {
				if ( workIconCount > playIconCount ) {
					$('#life-type').html("专业工作狂");
				} else if ( workIconCount < playIconCount )  {
					$('#life-type').html("天生爱玩客");
				} else {
					$('#life-type').html("平衡生活家");
				}
				
			} else {
				$('#life-type').html("无聊的生活");
			}
			
			
			if ( icon.data('isSelected') ) {
				icon.data('isSelected',false);
				line.attr({"path":""});
				return;
			} else {
				icon.data('isSelected',true);
			}
			
			
			
			//generate animation array
			var breakPoint1X, breakPoint1Y, breakPoint2X, breakPoint2Y;
			var deltaX = linesEndX - linesStartX;
			var deltaY = linesEndY - linesStartY;
			if ( deltaX > 0 ) {
				deltaX = deltaX +100;
			} else {
				deltaX = deltaX - 100;
			}
			
			if ( deltaY > 0 ) {
				deltaY += 100;
			} else {
				
				deltaY -= 100;
			}
			
			breakPoint1X = linesStartX + Math.floor(deltaX * (Math.random() * 0.4 + 0.1));
			breakPoint1Y = linesStartY + Math.floor(deltaY * (Math.random() * 0.4 + 0.1));
			
			deltaX = linesEndX - breakPoint1X;
			deltaY = linesEndY - breakPoint1Y;
			
			if ( deltaX > 0 ) {
				deltaX += 25;
			} else {
				deltaX -= 25;
			}
			
			if ( deltaY > 0 ) {
				deltaY += 25;
			} else {
				deltaY -= 25;
			}
			
			breakPoint2X = breakPoint1X + Math.floor(deltaX * 0.67);
			breakPoint2Y = breakPoint1Y + Math.floor(deltaY * 0.67);
			
			var drawLineAnimations = [
				{startX:linesStartX, startY:linesStartY, endX:breakPoint1X, endY: linesStartY, stepCount:12},
				{startX:breakPoint1X, startY:linesStartY, endX:breakPoint1X, endY: breakPoint1Y, stepCount:12},
				{startX:breakPoint1X, startY:breakPoint1Y, endX:breakPoint2X, endY: breakPoint1Y, stepCount:12},
				{startX:breakPoint2X, startY:breakPoint1Y, endX:breakPoint2X, endY: breakPoint2Y, stepCount:12},
				{startX:breakPoint2X, startY:breakPoint2Y, endX:linesEndX, endY: breakPoint2Y, stepCount:12},
				{startX:linesEndX, startY:breakPoint2Y, endX:linesEndX, endY: linesEndY, step:12}
			];
			


			var oldPath = "";
			var index = 0;
			animation = drawLineAnimations[index];
			
			function drawLineTo(pathToDraw, startX, startY, endX, endY, stepCount){
				var counter = 0;
				var stepX = (endX - startX) / stepCount ;
				var stepY =(endY - startY) / stepCount ;
				
				
				function drawStep() {
					counter ++;
					var pathStr;
					if ( index == 0 ) {
						pathStr = "M" + startX + "," + startY + "L" + (startX + counter * stepX) + ',' + (startY + counter * stepY);

					} else {
						pathStr  = oldPath + "L" + (startX + counter * stepX) + ',' + (startY + counter * stepY);
					}
										
					pathToDraw.attr({
						"path":pathStr
					});
					if ( counter < stepCount ) {
						setTimeout(drawStep);
					} else {
						oldPath = pathStr;
						index ++;
						
						if ( index < drawLineAnimations.length ) {
							animation = drawLineAnimations[index];
							drawLineTo(line, animation.startX, animation.startY, animation.endX, animation.endY, 20);
						}
					}
					
					
				}
				drawStep();
			}
			
			drawLineTo(line, animation.startX, animation.startY, animation.endX, animation.endY, 20);
			
			
			
			
		});
		
		
	},
	initQuestionHint : function() {
		//this.el.find('.drink').hint('#hint-drink');
	},
	initAnswerTooltip : function() {
		this.el.find('.life-icon').tooltip();
	}
}