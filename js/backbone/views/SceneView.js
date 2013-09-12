var app = app || {};

var MainView = Backbone.View.extend({
    
    events: {
        "click #next": "processToNextQuestion",
        "click #prev" : "processToPrevQuestion",
        "click #saveReport" : "showLogin",
        "click #weibologin" : "authorize",
        "click #login .close" : "closeLogin",
        "click #nologin" : "showReport",
        "click #eraseCookie" : "eraseCookie",
        "click .jiathis_button_tsina" : "shareWeibo"
    },
    initialize: function () {
        this.$el = $('body');
        
        
    },
    shareWeibo : function() {
        app.Report.shareReport();
    },
    processToNextQuestion: function () {
        AppFacade.getCurrentView().next();
    },
    processToPrevQuestion: function() {
        AppFacade.getCurrentView().prev();
    },
    showLogin : function() {
        $("#login").removeClass("hidden");
    },
    closeLogin : function() {
        $("#login").addClass("hidden");
    },
    authorize : function() {
        if(typeof app.User.uid == 'undefined') {
            var requestUri = app.weiboApp.authorize_uri + "?client_id=" + app.weiboApp.app_id + "&redirect_uri=" + app.weiboApp.redirect_uri + "&response_type=code";
            AppFacade.saveToCookie();
            window.location = requestUri;
        }
    },
    showReport : function() {
    	AppFacade.askForReport();
    },
    eraseCookie : function() {
    	if(confirm("删除本地答题记录？")) {
	    	eraseCookie("user_answers");
	    	window.location.reload();
    	}
	    
    }
});

var LifeView = Backbone.View.extend({
    tagName: "div",
    id: "scene-life",
    className: "scene",
    template: $("#scene-life-template").html(),
    events : {
        "click .life-icon" : "toggleLife"
    },
    linesEl : '#life-lines',
	lines : [],
    
    initialize: function() {
		var self = this;
		this.$el = $('#main');
        this.lines = [];
        this.on("render",this.postrender);
	},
	initQuestionHint : function() {
	},
	initAnswerTooltip : function() {
		this.$el.find('.life-icon').tooltip();
	},
    animateIn: function () {
        AnimationHandler.animateIn();
    },
    initLife : function() {
        var answers = this.model.getUserAnswerByQuestionId(11).answer_ids;
        for( var i=0;i<answers.length;i++) {
            this.drawLifeLine({currentTarget: $('div[data-answer-id=' + answers[i] + ']')});
        }
    },
    initStress : function() {
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
        var stressHigh,stressMedium,stressLow,stressPin,stressPinRoot,stressHighText,stressMediumText,stressLowText;
        var self = this;
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
            self.model.setAnswer(28,134);
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
            
            self.model.setAnswer(28,135);
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
            
            self.model.setAnswer(28,136);
         });
		
		
		stressHighText = lifeCenter.text(32,50,"压力山大")
        .attr({
	        "font-size":"10px",
	        "fill":"#FFF",
	        "cursor":"pointer",
	        "transform":"r-60 32 50"
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
            self.model.setAnswer(28,134);
         });
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
            
            self.model.setAnswer(28,135);
         });
        stressLowText = lifeCenter.text(168,50,"轻轻松松")
        .attr({
	        "font-size":"10px",
	        "cursor":"pointer",
	        "fill":"#fff",
	        "transform":"r60 168 50"
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
            self.model.setAnswer(28,136);
         });
        
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
    },

    drawLifeLine : function(event) {
        var icon = $(event.currentTarget);
        //below is draw line
        var linesEndX = icon.position().left;
		var linesEndY = icon.position().top;
		var line = this.lines[icon.index()];
	    var linesStartX = $(this.linesEl).width() / 2;
		var linesStartY = $(this.linesEl).height() / 2;


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
    },
    
    toggleLife : function( event ) {
        var icon = $(event.currentTarget);
		
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
		var isSelected = icon.data('isselected') == "1" ;
        this.model.setAnswer( icon.parent().data("question-id"), icon.data("answer-id"), !isSelected);
        icon.data("isselected", !isSelected ? "1" : "0" );
        var line = this.lines[icon.index()];
		if ( isSelected ) {
			line.attr({"path":""});
			return;
		} 
		this.drawLifeLine(event);	
        
    },
    render: function () {
        this.$el.html(Mustache.render(this.template, this.model));
        this.initAnswerTooltip();
        this.initQuestionHint();
		this.initAnswerTooltip();
        this.initStress();
        var linesPaper = Raphael("life-lines", $(this.linesEl).width(), $(this.linesEl).height());
        var linesCount = $('.life-icon').size();
        this.lines = [];
		for ( var i = 0 ; i < linesCount; i++ ) {
			var line = linesPaper.path()
			.attr({
			"stroke":"#e4600d",
			"stroke-width":4,
			"stroke-linejoin":"round"
			});
			this.lines.push(line);
		}

        this.initLife();
        this.trigger("render");
        return this;
    },
    next: function () {
    	var unfinishedQuestion = this.model.isSceneFinished();
    	if ( unfinishedQuestion.length > 0  ) {
    		AppFacade.showHelp(unfinishedQuestion);
	    	return;
    	}
        var nextView = app.Views.HealthView;
        AppFacade.setCurrentView(nextView);
        this.onexit();
       
    },
    prev : function() {
        var prevView = app.Views.HairQualityView;
        AppFacade.setCurrentView(prevView);
        this.onexit();
    },
    postrender: function () {
        AnimationHandler.initialize('#scene-life-content');
        this.animateIn();
    },
    onexit : function() {
	    AnimationHandler.animateOut("next", function () { AppFacade.getCurrentView().render(); });
	    AppFacade.saveToCookie();
    }
});

var CleaningView = Backbone.View.extend({
    tagName: "div",
    id: "scene-cleaning",
    className: "scene",
    template: $("#scene-cleaning-template").html(),
    events: {
        'click #cleaning-trash-remove': "increaseFreq",
        'click #cleaning-trash-add, #cleaning-trash-content': "decreaseFreq",
        'click #shower-time-day' : "dayShower",
        'click #shower-time-night' : "nightShower",
        'click .cleaning-tool,.cleaning-style, .cleaning-care' : "toggleCleaningProduct",
        'click #shower-frequency-remove' : "decreaseShowerFreq",
        'click #shower-frequency-add' : "increaseShowerFreq"
    },

    increaseShowerFreq : function(event) {
        var item = $(event.currentTarget);
        var frequency = $('#shower-frequency').data('degree');
		if ( frequency ) {
			frequency++;
			if ( frequency > 5) {
				frequency = 1;
			}
		} else {
			frequency = 1;
		}
		var question_id = parseInt(item.parent().data("question-id"));
		$('#shower-frequency').data('degree',frequency);
		$('#shower-frequency-text').html(this.model.getAnswerTextByDegree( question_id, frequency))
        this.model.setAnswerByDegree(question_id, frequency, true);
		this.showShowerWater(frequency);
    },

    decreaseShowerFreq : function(event) {
        var item = $(event.currentTarget);
        var frequency = $('#shower-frequency').data('degree');
		if ( frequency ) {
			frequency--;
			if ( frequency < 1) {
				frequency = 5;
			}
		} else {
			frequency = 5;
		}
        var question_id = parseInt(item.parent().data("question-id"));
		$('#shower-frequency').data('degree',frequency);
		$('#shower-frequency-text').html(this.model.getAnswerTextByDegree( question_id, frequency))
        this.model.setAnswerByDegree(question_id, frequency, true);
		this.showShowerWater(frequency);
    },

    toggleCleaningProduct : function(event) {
        var item = $(event.currentTarget);
        if (item.attr('data-answer-id') == '39') {
	        // is shampoo
	        return;
        }
        item.toggleClass('selected');
        this.model.setAnswer(parseInt(item.parent().parent().data("question-id")), parseInt(item.data("answer-id") ), true);
    },
    animateIn: function () {
        AnimationHandler.animateIn();
    },
    dayShower : function(event) {
        var item = $(event.currentTarget);
		item.toggleClass('selected');
		if( $('.shower-time-icon.selected').size() < 1 ) {
			console.log('here');
			item.siblings().addClass('selected');
		}
		this.setShowerTimeAnswer();
		
    },
    nightShower : function(event) {
        var item = $(event.currentTarget);
		item.toggleClass('selected');
		if( $('.shower-time-icon.selected').size() < 1 ) {
			item.siblings().addClass('selected');
		}
		this.setShowerTimeAnswer();
    },
    setShowerTimeAnswer : function() {
	    var isShowerAtDay =  $('#shower-time-day').hasClass('selected');
	    var isShowerAtNight = $('#shower-time-night').hasClass('selected');
	    
	    if ( isShowerAtDay && isShowerAtNight ) {
		    this.model.setAnswer(29,139,true);
	    } else if (isShowerAtDay){
		    this.model.setAnswer(29,137,true);
	    } else if ( isShowerAtNight ) {
		    this.model.setAnswer(29,138,true);
	    }
    },
    increaseFreq: function () {
        var trash = $('#cleaning-trash-content');
        var degree = trash.data('degree');
        if (degree) {
            if (degree == 4) {
                degree = 1;
            } else {
                degree = parseInt(degree) + 1;
            }
        } else {
            degree = 2;
            trash.removeClass('trash-unselected');
        }
        trash.attr('class', 'trash-' + degree);
        var question_id = trash.parent().data("question-id");
        var title = this.model.getAnswerTextByDegree(question_id, degree);
        $('#cleaning-trash-text').html(title);
        trash.data('degree', '' + degree);
        this.model.setAnswerByDegree( question_id, degree, true);
    },
    decreaseFreq: function () {
        var trash = $('#cleaning-trash-content');
        var degree = trash.data('degree');
        if (degree) {
            if (degree == 1) {
                degree = 4;
            } else {
                degree = parseInt(degree) - 1;
            }
        } else {
            degree = 4;
            trash.removeClass('trash-unselected');
        }
        
        trash.attr('class', 'trash-' + degree);
        var question_id = trash.parent().data("question-id");
        var title = this.model.getAnswerTextByDegree(question_id, degree);
        $('#cleaning-trash-text').html(title);
        trash.data('degree', '' + degree);
        this.model.setAnswerByDegree(question_id , degree, true);
    },
    waterAnimation: function(item) {
		var self = this;
		if ( item.data("show") && item.data("show")>0 ) {
				var duration = Math.floor( 500 * Math.random()) + 500;
				item.fadeIn(duration, function() {
					$(this).fadeOut( duration, function() {
						self.waterAnimation($(this));
					});
				});
		}
	},
	showShowerWater : function(frequency) {
		for ( var i = -1; i < 5 ; i++ ) {
			var wateritem = $('#water-item-' + (i+1) );
			if ( i < frequency) {
				if ( !(wateritem.data('show')  && wateritem.data("show")>0)) {
					wateritem.data('show',1);
					this.waterAnimation(wateritem);
				}
			} else {
				wateritem.data('show',-1);
				$('#water-item-' + (i+1) ).hide();
			}
		}
	},
    initialize: function () {
        this.$el = $('#main');
        this.on("render", this.postrender);
        this.on("beginRender", this.render);
    },
    initAnswerTooltip: function () {
        this.$el.find('.cleaning-tool,.cleaning-style,.cleaning-care').tooltip();
    },
    render: function () {
    	//default select shampoo
        this.model.setAnswer(10,39,true);
        
        this.$el.html(Mustache.render(this.template, this.model));
        this.initAnswerTooltip();
        this.trigger("render");
        return this;
    },
    postrender: function () {
        AnimationHandler.initialize('#scene-cleaning-content');
        this.animateIn();
    },
    prev : function() {
        var prevView = app.Views.DietView;
        AppFacade.setCurrentView(prevView);
        this.onexit();
    },
    next: function () {
    	var unfinishedQuestion = this.model.isSceneFinished();
    	if ( unfinishedQuestion.length > 0  ) {
    		AppFacade.showHelp(unfinishedQuestion);
	    	return;
    	}
        var nextView = app.Views.SalonView;
        AppFacade.setCurrentView(nextView);
        this.onexit();
    },
    onexit : function() {
	    AnimationHandler.animateOut("next", function () { AppFacade.getCurrentView().render(); });
	    AppFacade.saveToCookie();
    }
});

var HealthView = Backbone.View.extend({
    tagName: "div",
    id: 'scene-health',
    className: "scene",
    template: $('#scene-health-template').html(),

    events: {
        "click .health-degree-content": "answerHealthQuestions"
    },

    answerHealthQuestions: function (event) {
        //calculate the degree base on y position
        var item = event.currentTarget;
        var degreeContent = $(item);

        var degreesCount = parseInt(degreeContent.find('.health-degree-item').size());
        var degree = Math.ceil((degreeContent.offset().top + degreeContent.height() - event.pageY) / degreeContent.height() * degreesCount);

        degree = Math.min(degreesCount, degree);
        degree = Math.max(1, degree);

        degreeContent.attr('class', 'health-degree-content').addClass('onDegree-' + degree);
        degreeContent.find('.health-degree-hint').html(degreeContent.find('[data-degree="' + degree + '"]').attr('title'));

        this.model.setAnswerByDegree(parseInt($(item).attr("data-question-id")), degree, true);
    },

    initHealthQuestions: function () {
        var that = this;
        this.$el.find('.health-degree-pin').draggable({
            axis: "y",
            containment: "parent",
            stop: function () {

                //calculate the degree base on y position
                var degreeContent = $(this).parent();

                var degreesCount = parseInt(degreeContent.find('.health-degree-item').size());
                var degree = Math.ceil((degreeContent.offset().top + degreeContent.height() - $(this).offset().top) / degreeContent.height() * degreesCount);

                degree = Math.min(degreesCount, degree);
                degree = Math.max(1, degree);

                degreeContent.attr('class', 'health-degree-content').addClass('onDegree-' + degree);
                degreeContent.find('.health-degree-hint').html(degreeContent.find('[data-degree="' + degree + '"]').attr('title'));

                that.model.setAnswerByDegree(parseInt($(degreeContent).attr("data-question-id")), degree, true);
                $(this).attr('style', '');
            }
        });
    },

    initAnswerTooltip: function () {
        this.$el.find('.health-degree-item').tooltip();
    },

    animateIn: function () {
        AnimationHandler.animateIn();
    },

    initialize: function () {
        this.$el = $('#main');
        this.on("render", this.postrender);
        this.on("beginRender", this.render);
    },
    // Re-render the titles of the todo item.
    render: function () {
        this.$el.html(Mustache.render(this.template, this.model));
        this.initAnswerTooltip();
        this.initHealthQuestions();
        this.trigger("render");
        return this;
    },

    postrender: function () {
        AnimationHandler.initialize('#scene-health-content');
        this.animateIn();
    },
    prev : function() {
        var prevView = app.Views.LifeView;
        AppFacade.setCurrentView(prevView);
        this.onexit();
    },
    next: function () {
    	var unfinishedQuestion = this.model.isSceneFinished();
    	if ( unfinishedQuestion.length > 0  ) {
    		AppFacade.showHelp(unfinishedQuestion);
	    	return;
    	}
        var nextView = app.Views.DietView;
        AppFacade.setCurrentView(nextView);
        this.onexit();
    },
    onexit : function() {
	    AnimationHandler.animateOut("next", function () { AppFacade.getCurrentView().render(); });
	    AppFacade.saveToCookie();
    }
});

var DietView = Backbone.View.extend({

    //... is a list tag.
    tagName: "div",
    id: "scene-diet",
    className: "scene",
    // Cache the template function for a single item.
    template: $('#scene-diet-template').html(),

    events: {
        "click .taste": "answerTasteQuestion",
        "click .drink": "answerDrinkQuestion",
        "click #fruit": "answerFruitQuestion",
        "click .cooking": "answerCookingQuestion"
    },

    animateIn: function () {
        AnimationHandler.animateIn();
    },

    answerTasteQuestion: function (event) {
        var item = event.currentTarget;
        $(item).toggleClass('selected');
        var isSelected = $(item).attr('data-selected');

        this.model.setAnswer(parseInt($(item).parent().attr("data-question-id")), parseInt($(item).attr("data-answer-id")), isSelected);

        if (isSelected) {
            $(item).attr('data-selected', 0);
        } else {
            $(item).attr('data-selected', 1);
        }

    },

    answerFruitQuestion: function (event) {
        var item = event.currentTarget;
        var width = $(item).width();
        var degree = Math.max(Math.min(Math.floor((event.pageX - $(item).offset().left) / width * 4), 3), 0);
        $(item).attr('data-degree', degree);
        $(item).removeClass('fruit-degree-0').removeClass('fruit-degree-1').removeClass('fruit-degree-2').removeClass('fruit-degree-3').addClass('fruit-degree-' + degree).addClass('selected');
        this.model.setAnswerByAnswerIndex(parseInt($(item).attr("data-question-id")), degree, true);
    },

    answerDrinkQuestion: function (event) {
        var item = event.currentTarget;
        $(item).toggleClass('selected');
        var isSelected = $(item).attr('data-selected');
        this.model.setAnswer(parseInt($(item).parent().attr("data-question-id")),parseInt($(item).attr("data-answer-id")), isSelected);
        if (isSelected) {
            $(item).attr('data-selected', 0);
        } else {
            $(item).attr('data-selected', 1);
        }
    },
    answerCookingQuestion : function(event) {
	  	var item = $(event.currentTarget);  
	  	item.toggleClass('selected');
	  	item.siblings().removeClass('selected');
	  	var id = parseInt(item.attr("data-answer-id"));
	  	var isSelected = item.hasClass('selected');
	  	this.model.setAnswer(parseInt(item.parent().attr("data-question-id")),id, isSelected);
	  	
	  	if ( isSelected ) {
		  	switch(id) {
			  	case 1:
			  		$("#takeaway,#homemade").removeClass("selected");
			  		item.flyToAndHide($("#character-container"),function(){
				  		
			  		});
			  	break;
			  	case 2:
			  		$("#takeaway,#homemade").removeClass("selected");
			  		item.flyToAndHide($("#character-container"),function(){
				  		
			  		});
			  	break;
			  	case 3:
			  		item.flyToAndHide($("#homemade"),function(){
				  		$("#homemade").addClass("selected");
				  		$("#takeaway").removeClass("selected");
			  		});
			  	break;
			  	case 4:
			  		item.flyToAndHide($("#takeaway"),function(){
				  		$("#takeaway").addClass("selected");
				  		$("#homemade").removeClass("selected");
			  		});
			  	break;
			  	default:
			  	break;
		  	}
	  	}
	  	
    },

    initQuestionHint: function () {
        this.$el.find('.drink').hint('#hint-drink');
        this.$el.find('.taste').hint('#hint-taste');
        this.$el.find('.fruit').hint('#hint-fruit');
    },
    initAnswerTooltip: function () {
        this.$el.find('.drink,.taste,.fruit').tooltip();
    },
    initFruit: function () {
        var self = this;
        this.$el.find('#fruit').on('mousemove', function (e) {
            //set background postion base on degree
            var width = $(this).width();
            var degree = Math.max(Math.min(Math.floor((e.pageX - $(this).offset().left) / width * 4), 3), 0);

            $(this).removeClass('fruit-degree-0').removeClass('fruit-degree-1').removeClass('fruit-degree-2').removeClass('fruit-degree-3').addClass('fruit-degree-' + degree);

            //update tooltip
            var title = app.QuestionRepo.findWhere({ name: "fruit" }).get("answers")[degree].text;
            $('#tooltip .content').html(title);

        }).on('mouseleave', function (e) {
            //set background postion base on degree data
            var degree = $(this).attr('data-degree');
            $(this).removeClass('fruit-degree-0').removeClass('fruit-degree-1').removeClass('fruit-degree-2').removeClass('fruit-degree-3').addClass('fruit-degree-' + degree);

        })
    },

    initialize: function () {
        this.$el = $('#main');
        this.on("render", this.postrender);
        this.on("beginRender", this.render);
    },

    // Re-render the titles of the todo item.
    render: function () {
        this.$el.html(Mustache.render(this.template, this.model));
		app.Views.AvatarView.render();
        this.initQuestionHint();
        this.initAnswerTooltip();
        this.initFruit();
		
        this.trigger("render");
        return this;
    },

    postrender: function () {
        AnimationHandler.initialize('#scene-diet-content');
        this.animateIn();
    },
    prev : function() {
        var prevView = app.Views.HealthView;
        AppFacade.setCurrentView(prevView);
        this.onexit();
    },
    next: function () {
    	var unfinishedQuestion = this.model.isSceneFinished();
    	if ( unfinishedQuestion.length > 0  ) {
    		AppFacade.showHelp(unfinishedQuestion);
	    	return;
    	}
        var nextView = app.Views.CleaningView;
        AppFacade.setCurrentView(nextView);
        this.onexit();
    },
    onexit : function() {
	    $("#character-container").fadeOut();
	    AnimationHandler.animateOut("next", function () { AppFacade.getCurrentView().render(); });
	    AppFacade.saveToCookie();
    }

});

var HairStyleView = Backbone.View.extend( {
  //... is a list tag.
    tagName: "div",
    id: "scene-hairstyle",
    className: "scene",
    // Cache the template function for a single item.
    template: $('#scene-hairstyle-template').html(),

    events: {
        "click #haircolor-red,#haircolor-gold,#haircolor-black,#haircolor-mixed" : "setHairColor",
        "click #hand,#pin,#band,#comb" : "setHairState",
        "click .hairstyle-circle" : "setHairCircle"
    },

    initHairCircle : function() {
        var self = this;
        var length = $('#hairstyle-length .hairstyle-circle-dragable');
        var curl = $('#hairstyle-curl .hairstyle-circle-dragable');
        
        defaultLength = parseInt(length.parent().attr('data-degree'));
        defaultCurl = parseInt(curl.parent().attr('data-degree'));
        
        if (!defaultLength) {
	        defaultLength = 4;
        }
        if (!defaultCurl) {
	        defaultLength = 2;
        }
        length.data('dragcircle',{
			$circle: $('#hairstyle-length .hairstyle-circle'),
            degree:5
		}).setDegree(defaultLength);
		curl.data('dragcircle',{
			$circle: $('#hairstyle-curl .hairstyle-circle'),
            degree:4
		}).setDegree(defaultCurl);
		
		$('#hairstyle-length .hairstyle-circle-dragable,#hairstyle-curl .hairstyle-circle-dragable').draggable({
			start: function(event,ui){
				var data = $( this ).data('dragcircle');
                if ( ! data.radius ) 
                {
					data.radius = data.$circle.height() / 2;
					data.startX =  data.$circle.offset().left;
					data.startY =  data.$circle.offset().top;
                    data.centerX = data.$circle.position().left + data.radius;
                    data.centerY = data.$circle.position().top + data.radius;
                    $( this ).data('dragcircle', data );
               }
			},
			drag: function(event,ui) {
				var data = $( this ).data('dragcircle'),
                angle = Math.atan2( event.pageX - data.centerX - data.startX, event.pageY - data.centerY - data.startY );
                data.angle = angle;
                ui.position.top = data.centerY + Math.cos( angle )*data.radius;
                ui.position.left = data.centerX + Math.sin( angle )*data.radius;
			},
			stop: function(event,ui){
				$(this).setDegree();
				
				var question_id = parseInt($(this).parent().parent().data("question-id"));
				var degree = parseInt($(this).data('degree'));
				
                self.model.setAnswerByDegree(question_id, degree, true);
                $(this).parent().find('.hairstyle-text').html(self.model.getAnswerTextByDegree(question_id, degree));
                
				self.setHairStyle();
			}
			
		});
    },
    setHairCircle : function(event) {
        var $circle = $(event.currentTarget);
		var data = $circle.find('.hairstyle-circle-dragable').data('dragcircle');
			
		if ( ! data.radius ) 
        {
                	
			data.radius = data.$circle.height() / 2;
			data.startX =  data.$circle.offset().left;
			data.startY =  data.$circle.offset().top;
            data.centerX = data.$circle.position().left + data.radius;
            data.centerY = data.$circle.position().top + data.radius;
                        
            
                        
        }
        angle = Math.atan2( event.pageX - data.centerX - data.startX, event.pageY - data.centerY - data.startY );
        data.angle = angle;
		$circle.find('.hairstyle-circle-dragable').data('dragcircle', data );
        $circle.find('.hairstyle-circle-dragable').setDegree();
        
        var question_id = parseInt($circle.parent().data("question-id"));
		var degree = parseInt($circle.find('.hairstyle-circle-dragable').data('degree'));
		console.log(question_id);
				
        this.model.setAnswerByDegree(question_id, degree, true);
        $circle.find('.hairstyle-text').html(this.model.getAnswerTextByDegree(question_id, degree));
		this.setHairStyle();
    },
    setHairState : function(event) {
        var item = $(event.currentTarget);
        item.siblings().removeClass('selected');
        item.addClass('selected');
        this.model.setAnswer(item.parent().data("question-id"), item.data("answer-id"), true);
        this.setHairStyle();

    },
    setHairColor : function(event) {
        var item = $(event.currentTarget);
        item.siblings().removeClass('selected');
        item.addClass('selected');
        this.model.setAnswer(parseInt(item.parent().data("question-id")), parseInt(item.data("answer-id")), true);
        this.setHairStyle();
    },
    getHairData: function() {
        var hairData = {
			length : this.model.getAnswerName(13),
			curl : this.model.getAnswerDegree(14),
            color:  this.model.getAnswerName(15),
            type: this.model.getAnswerName(16)
		};
        if (typeof hairData.length === 'undefined' || hairData.length == '') {
            hairData.length = 'l';
        }
        if (hairData.curl == 0) {
            hairData.curl = 2;
        }
        if (hairData.color == '') {
            hairData.color = 'red';
        }
        return hairData;
    },
	setHairStyle : function() {
		var hairData = this.getHairData();
		var gender = app.Views.AvatarView.model.gender;
		
		var hairStr = 'hair hair-' + gender + '-' + hairData.type + ' hair-' + hairData.color + ' hair-' + gender +'-' +  hairData.length + "-" + hairData.curl;
		var bangStr = 'bang bang-' + gender + '-' + hairData.type + ' bang-' + hairData.color + ' bang-' + gender +'-' +  hairData.length + "-" + hairData.curl;
		
		$('.hair').attr('class',hairStr);
		$('.bang').attr('class',bangStr);
		
		$('#hairstyle-length .hairstyle-icon').attr('class','hairstyle-icon len-'+hairData.length);
		$('#hairstyle-curl .hairstyle-icon').attr('class','hairstyle-icon curl-'+hairData.curl);
	}, 

    initialize: function () {
        this.$el = $('#main');
        this.on("render", this.postrender);
        this.on("beginRender", this.render);
        
    },
    animateIn: function () {
        AnimationHandler.animateIn();
    },
    // Re-render the titles of the todo item.
    render: function () {
        this.$el.html(Mustache.render(this.template, this.model));
        var hairData = this.getHairData();
        app.Views.AvatarView.model.hairCurly = hairData.curl;
        app.Views.AvatarView.model.hairLength = hairData.length;
        app.Views.AvatarView.model.hairColor = hairData.color;
        app.Views.AvatarView.render();
        this.initHairCircle();
        this.trigger("render");
        return this;
    },

    postrender: function () {
    	 $("#character-container").fadeIn();
        AnimationHandler.initialize('#scene-hairstyle-content');
        this.animateIn();
        this.initAnswerTooltip();
    },
    prev : function() {
        var prevView = app.Views.BasicInfoView;
        AppFacade.setCurrentView(prevView);
        app.Router.navigate("Survey/" + prevView.model.get("scene_id"));
        this.onexit();
    },
    next: function () {
    	var unfinishedQuestion = this.model.isSceneFinished();
    	if ( unfinishedQuestion.length > 0  ) {
    		AppFacade.showHelp(unfinishedQuestion);
	    	return;
    	}
        var nextView = app.Views.HairQualityView;
        AppFacade.setCurrentView(nextView);
        app.Router.navigate("Survey/" + nextView.model.get("scene_id"));
        this.onexit();
    },
    onexit : function() {
	    $("#character-container").fadeOut();
	    AnimationHandler.animateOut("next", function () { AppFacade.getCurrentView().render(); });
	    AppFacade.saveToCookie();
    },
    initAnswerTooltip: function(){
	    $('.hairtype-icon,.haircolor').tooltip();
    }
});



var HairQualityView = Backbone.View.extend( {
  //... is a list tag.
    tagName: "div",
    id: "scene-hairquality",
    className: "scene",
    // Cache the template function for a single item.
    template: $('#scene-hairquality-template').html(),

    events: {
       "click .quality-progress-dot": "onClickProgressDot",
       "click .quality-progress-bar": "onClickProgressBar",
       "click .problem-item": "onClickProblem"
    },

    initialize: function () {
        this.$el = $('#main');
        this.on("render", this.postrender);
        this.on("beginRender", this.render);
        
    },
    animateIn: function () {
        AnimationHandler.animateIn();
    },
    // Re-render the titles of the todo item.
    render: function () {
    	var self = this;
        this.$el.html(Mustache.render(this.template, this.model));
        app.Views.AvatarView.render();
        $('.quality-progree-draggable').draggable({
			axis: "x",
			containment: "parent",
			stop : function(event, ui) {
				var draggable = $(this);
				var bar = draggable.parent();

				var degree = geDegreeByXPosition( draggable.position().left, bar.width() , parseInt(bar.attr("data-degree-count")) );
				
				self.setDegree(bar, degree);
				
			}
		});
        this.trigger("render");
        return this;
    },

    postrender: function () {
        AnimationHandler.initialize('#scene-hairquality-content');
        
        this.animateIn();
    },
    prev : function() {
        var prevView = app.Views.HairStyleView;
        AppFacade.setCurrentView(prevView);
        app.Router.navigate("Survey/" + prevView.model.get("scene_id"));
        this.onexit();
    },
    next: function () {
    	var unfinishedQuestion = this.model.isSceneFinished();
    	if ( unfinishedQuestion.length > 0  ) {
    		AppFacade.showHelp(unfinishedQuestion);
	    	return;
    	}
        var nextView = app.Views.LifeView;
        AppFacade.setCurrentView(nextView);
        app.Router.navigate("Survey/" + nextView.model.get("scene_id"));
        this.onexit();
    },
    onexit : function() {
	    $("#character-container").fadeOut();
	    AnimationHandler.animateOut("next", function () { AppFacade.getCurrentView().render(); });
	    AppFacade.saveToCookie();
    },
    onClickProgressBar : function(e) {
	  var bar = $(e.currentTarget);
	  var left = e.pageX - bar.offset().left;
	  var degree =   geDegreeByXPosition( left, bar.width() , parseInt(bar.attr("data-degree-count")) );

	   this.setDegree( bar, degree);
    },
    onClickProgressDot : function(e) {
	    e.preventDefault();
    	e.stopPropagation();
	    var node = $(e.currentTarget);
	    var degree = node.parent().children().index(node) + 1;
	    this.setDegree( node.parent(), degree);

    },
    onClickProblem : function(e) {
    	
	    var problem = $(e.currentTarget);
	    var problemIndex = problem.parent().children().index(problem) + 1;
	    
	    var question_id = parseInt(problem.parent().attr("data-question-id"));
	    var answer_id = parseInt(problem.attr("data-answer-id"));
	    
	    if ( problem.data('selected') || problem.hasClass("problem-item hairproblem-" + problemIndex + "-selected") ) {
		    problem.data('selected',false);
		    problem.attr("class", "problem-item hairproblem-" + problemIndex + "-");
		    
		    
		    
		    this.model.setAnswer(question_id, answer_id, false);
	    } else {
		    problem.data('selected',true);
		    problem.attr("class", "problem-item hairproblem-" + problemIndex + "-selected");
		    this.model.setAnswer(question_id, answer_id, true);
		    
		    var count = 2;
		    var originClass = problem.attr('class');
		    var timer = setInterval(function(){
			    if ( count == 6 ) {
				 	problem.attr('class', originClass );
				 	clearInterval(timer);
			    } else {
				    problem.attr('class', originClass + " hairproblem-" + problemIndex + "-" + count);
				    count++;
			    }
		    }, 150);
		    app.Views.AvatarView.sad();
		}
	    

    },
    setDegree : function(barEl, degree) {
	    var draggable = barEl.find(".quality-progree-draggable");
	    var node = $(barEl.children().get(degree - 1));
	    draggable.animate({"left": node.position().left},500);
	    draggable.removeClass("on-degree-").removeClass("on-degree-0");
		draggable.text(node.attr("title"));
		this.model.setAnswerByDegree(parseInt(barEl.attr("data-question-id")), degree, true);
		
		this.setMagnifierClass();
    },
    setMagnifierClass : function() {
	    var qualityDegree = this.model.getAnswerDegree(18); 
	    var thicknessDegree = this.model.getAnswerDegree(19); 
	    var volumeDegree = this.model.getAnswerDegree(20);
	    var classStr = "quality-" + qualityDegree + " thickness-" + thicknessDegree + " volume-" + volumeDegree;
	    this.$el.find('#magnifier-glass').attr('class', classStr);
    }
});


var BasicInfoView = Backbone.View.extend( {
  //... is a list tag.
    tagName: "div",
    id: "scene-basicinfo",
    className: "scene",
    // Cache the template function for a single item.
    template: $('#scene-basicinfo-template').html(),

    events: {
        "click #basicinfo-career .clothes" : "setCareer",
        "click .age-item" : "setAge",
        "mouseenter #basicinfo-age" : "mouseEnterAge",
        "mouseleave #basicinfo-age" : "mouseLeaveAge"
    },

    initialize: function () {
        this.$el = $('#main');
        this.on("render", this.postrender);
        this.on("beginRender", this.render);
        
        
        
    },
    animateIn: function () {
    	
        AnimationHandler.animateIn();
    },
    
    // Re-render the titles of the todo item.
    render: function () {
        this.$el.html(Mustache.render(this.template, this.model));
        app.Views.AvatarView.render();
        this.trigger("render");
        return this;
    },

    postrender: function () {
    	var self = this;
        AnimationHandler.initialize('#scene-basicinfo-content');
        this.animateIn();
        this.initAnswerTooltip();
        this.$el.find('#basicinfo-career .clothes').draggable({
	        start:function(){
		        $(this).data('originLeft',$(this).css('left'));
	        },
	        stop:function(){
		        $(this).css({
			       'left':$(this).data('originLeft'),
			       'top':0 
		        });
		        var event ={};
		        event.currentTarget = this;
		        self.setCareer(event); 
	        }
        });
    },
    prev : function() {
    	$("#character-container").fadeOut();
    	AnimationHandler.animateOut("next", function () { AppFacade.initSplash(); });
    	
    },
    onexit : function() {
    	
	    $("#character-container").fadeOut();
	    $('#prev').fadeIn();
	    AnimationHandler.animateOut("next", function () { AppFacade.getCurrentView().render(); });
	    AppFacade.saveToCookie();
    },
    next: function () {
    	var unfinishedQuestion = this.model.isSceneFinished();
    	if ( unfinishedQuestion.length > 0  ) {
    		AppFacade.showHelp(unfinishedQuestion);
	    	return;
    	}
        var nextView = app.Views.HairStyleView;
        AppFacade.setCurrentView(nextView);
        app.Router.navigate("Survey/" + nextView.model.get("scene_id"));
        this.onexit();
        
    },
    setCareer : function(event) {
    	this.$el.find('#basicinfo-career .clothes:hidden').show();
	    
	    var career = $(event.currentTarget).hide();
	    var careerId = career.attr('data-id');
	    var gender = this.model.getAnswerName(22);
	    
	    $('.character .clothes').attr('class','clothes clothes-'+gender+'-'+careerId);
	    
	    var question = career.parent().attr('data-question-id');
	    var answer = career.attr('data-answer-id');
	    this.model.setAnswer(parseInt(question), parseInt(answer), true);
    },
    setAge : function(event) {
	    var age = this.$el.find("#basicinfo-age");
	    var gender = this.model.getAnswerName(22);
	    var degree = $(event.currentTarget).attr('data-degree');
	    age.attr('class', 'item '+ gender + ' on-degree-' + degree );
	    
	    this.model.setAnswerByDegree( parseInt(age.attr('data-question-id')), parseInt(degree), true);
    },
    mouseEnterAge : function(event) {
	    $(event.currentTarget).addClass('mouseEnterAge');
    },
    mouseLeaveAge : function(event) {
	    $(event.currentTarget).removeClass('mouseEnterAge');
    }, 
    initQuestionHint: function () {

    },
    initAnswerTooltip: function () {
        this.$el.find('.clothes').tooltip();
    }
});


var SalonView = Backbone.View.extend( {
  //... is a list tag.
    tagName: "div",
    id: "scene-salon",
    className: "scene",
    // Cache the template function for a single item.
    template: $('#scene-salon-template').html(),
    events: {
       "click #character-chat-1 .chat-icon" : "onClickChatIcon",
       "click #character-chat-2 .chat-icon" : "onClickChatDegree"
    },
    initialize: function () {
        this.$el = $('#main');
        this.on("finishLoading", this.postrender);
        this.on("beginRender", this.render);
        this.on("render", this.postrender);
    },
    animateIn: function () {
        AnimationHandler.animateIn();
    },
    // Re-render the titles of the todo item.
    render: function () {
    	this.model.gender = app.Views.AvatarView.model.gender;
        this.$el.html(Mustache.render(this.template, this.model));
        this.trigger("render");
        return this;
    },
    postrender: function () {
        AnimationHandler.initialize('#scene-salon-content');
        
       
        this.animateIn();
        
		if ( this.model.isAnswered(25) ) {
			 $('#counselor-chat-1,#character-chat-1').fadeIn();
		 } else {
			 $('#counselor-chat-1').delay(2000).fadeIn(function(){
				$('#character-chat-1').fadeIn();
			});
		 }
		 if ( this.model.isAnswered(26) ) {
			 $('#counselor-chat-2,#character-chat-2').fadeIn();
		 }
		 if ( this.model.isAnswered(27) ) {
			 $('#counselor-chat-3').fadeIn();
		 }
    },
    prev: function () {
        var prevView = app.Views.CleaningView;
        AppFacade.setCurrentView(prevView);
        app.Router.navigate("Survey/" + prevView.model.get("scene_id"));
        this.onexit();
    },
    onexit : function() {
	    AnimationHandler.animateOut("next", function () 		{ AppFacade.getCurrentView().render(); });
	    AppFacade.saveToCookie();
    },
    next: function () {
    	var unfinishedQuestion = this.model.isSceneFinished();
    	if ( unfinishedQuestion.length > 0  ) {
    		AppFacade.showHelp(unfinishedQuestion);
	    	return;
    	}
    	AppFacade.saveToCookie();
    	if ( AppFacade.isLogin() ) {
			AppFacade.askForReport();
		} else {
			$("#login").removeClass("hidden");
		}
        
    },
    onClickChatIcon: function(event) {
	    var icon = $(event.currentTarget);
	    var isSelected = icon.hasClass('selected');
	    icon.toggleClass('selected');
	    this.model.setAnswer( parseInt(icon.parent().attr('data-question-id')), parseInt(icon.attr('data-answer-id')),!isSelected);
	    if ( $('#counselor-chat-2').is(':hidden') ) {
		    $('#counselor-chat-2').delay(1000).fadeIn(function(){
				$('#character-chat-2').fadeIn();
			});
	    }
    },
    onClickChatDegree: function(event) {
    	var icon = $(event.currentTarget);
    	var question_id = parseInt(icon.attr('data-question-id'));
    	var degree = this.model.getAnswerDegree(question_id);
    	if (degree == 5) {
	    	degree = 1;
    	} else {
	    	degree = degree + 1;
    	}
       	this.model.setAnswerByDegree(question_id, degree, true);
    	icon.attr('class','chat-icon on-degree-' + degree);
    	icon.find('.chat-icon-text').html(this.model.getAnswerTextByDegree(question_id,degree));
	    if ( $('#counselor-chat-3').is(':hidden') ) {
		    $('#counselor-chat-3').delay(2000).fadeIn(function(){
			});
	    }
    }
});