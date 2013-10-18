var app = app || {};

var MainView = Backbone.View.extend({
    
    events: {
        "click #next": "processToNextQuestion",
        "click #prev" : "processToPrevQuestion",
        "click #saveReport" : "showLogin",
        "click #login .close" : "closeLogin",
        "click #nologin" : "showReport",
        "click #eraseCookie" : "eraseCookie",
        "click .step": "onCLickStep",
        "click #logo,#siteTitle" : "onClickLogo",
        "click .help" : "onClickHelpLayer",
        "click #help-switch" : "onClickHelpSwitch",
        "click #social_login" : "showInQuizLogin",
        "click #inquiz-login .close" : "closeInQuizLogin",
        "click #flyToTop":"scrollTop",
        "click #init-help":"onClickInitHelp"
    },
    initialize: function () {
        this.$el = $('body');
        $('.step').tooltip();
        $('body').disableTextSelect();
    },
    processToNextQuestion: function () {
        AppFacade.getCurrentView().next();
        
        var currentSceneId = AppFacade.getCurrentSceneId();
        if ( currentSceneId > AppFacade.getMaxFinishedSceneId() ) {
	        AppFacade.maxSceneId = currentSceneId;
        }
        this.setProgressBar();
        this.setHelpSwitch();
    },
    processToPrevQuestion: function() {
        AppFacade.getCurrentView().prev();
        this.setProgressBar();
        this.setHelpSwitch();
    },
    setProgressBar: function() {
	    var stepid = AppFacade.getMaxFinishedSceneId();
	    var currentSceneId = AppFacade.getCurrentSceneId();
	    $('#progress').attr('class','step'+stepid + ' onstep' + currentSceneId);
    },
    setHelpSwitch: function() {
	    $('#help-switch').removeClass('opened');
    },
    onCLickStep: function(e) {
	  	var item = $(e.currentTarget);
	  	var step = parseInt(item.attr("data-step"));
	  	AppFacade.gotoScene(step);
    },
    showInQuizLogin : function() {
    	AppFacade.initInQuizLogin();
        $("#inquiz-login").removeClass("hidden");
        app.LoginFrom = "middle";
    },
    closeInQuizLogin : function() {
        $("#inquiz-login").addClass("hidden");
        app.LoginFrom = "";
    },
    showLogin : function() {
    	AppFacade.initFinishLogin();
        $("#login").removeClass("hidden");
        app.LoginFrom = "end";
    },
    closeLogin : function() {
        $("#login").addClass("hidden");
        
        app.LoginFrom = "";
    },
    authorize : function() {
        if(typeof app.User.uid == 'undefined') {
            var requestUri = app.weiboApp.authorize_uri + "?client_id=" + app.weiboApp.app_id + "&redirect_uri=" + app.weiboApp.redirect_uri + "&response_type=code";
            AppFacade.saveToCookie();
            window.location = requestUri;
        }
    },
    showReport : function() {
    	this.closeLogin();
    	AppFacade.askForReport();
    },
    eraseCookie : function(   ) {
    	if( confirm("删除本地答题记录？") ) {
	    	eraseCookie("user_answers");
	    	window.location.reload();
    	}
	    
    },
    onClickLogo : function() {
	    AppFacade.gotoScene(1);
    },
    onClickHelpLayer : function(e){
    	var help = $(e.currentTarget);
    	help.removeClass('showUnfinished');
    	help.find('.unfinished').removeClass('unfinished');
	    $('#help-switch').removeClass('opened');
	    help.hide();
    },
    onClickHelpSwitch : function(e) {
    	var help = $('.help');
    	help.removeClass('showUnfinished');
    	help.find('.unfinished').removeClass('unfinished');
	    $('.help').toggle();
	    $(e.currentTarget).toggleClass('opened');
	    $('#init-help').hide();
    },
    scrollTop : function() {
	    $(document).scrollTop(0);
	    $('#report-flyToTop').hide();
    },
    onClickInitHelp: function(e) {
	    $(e.currentTarget).hide();
    }
});

var LifeView = Backbone.View.extend({
    tagName: "div",
    id: "scene-life",
    className: "scene",
    template: $("#scene-life-template").html(),
    events : {
        "click .life-icon" : "toggleLife",
        "click .life-stress" : "onClickStress"
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
   setStressPin: function(stress) {
	   if ( stress == 'medium' ) {
		   this.stressPin.animate({
            	transform:""
            }, 500, 'back-out')
            .attr({
	            
            	"stroke":"#e4600d",
            	"stroke-dasharray":""
            });
            
            this.stressPinRoot.attr({
            	"fill":"#e4600d"
            });
            
            this.model.setAnswer(28,135);
	   } else if ( stress == 'high' ) {
		   this.stressPin.animate({
            	transform:"r-60 125 125"
            }, 500, 'back-out')
            .attr({
            	"stroke":"#e4600d",
            	"stroke-dasharray":""
            });
            
            this.stressPinRoot.attr({
            	"fill":"#e4600d"
            });
            this.model.setAnswer(28,134);
	   } else {
		   this.stressPin.animate({
            	"transform":"r60 125 125"
            }, 500, 'back-out')
            .attr({
            	"stroke":"#e4600d",
            	"stroke-dasharray":""
            });
            
            this.stressPinRoot.attr({
            	"fill":"#e4600d"
            });
            
            this.model.setAnswer(28,136);
	   }
	   
   },
   onClickStress: function(e) {
	 var item = $(e.currentTarget);
	 var stress = item.attr('data-stress');
	 this.setStressPin(stress);
   },
    initStress : function() {
        var lifeCenter = Raphael("life-center", 250, 250);
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
		    "stroke-width":0,
		    arc: [125, 125, -2, 3, 6, 110]
		});
		lifeCenter.path().attr({
		    "fill": "#fad949",
		    "stroke":"#e4600d",
		    "stroke-width": 30,
		    arc: [125, 125, 1, 3, 6, 110]
		});
		lifeCenter.path("M0 127L250 127").attr({
			"stroke":"#e4600d",
			"stroke-width": 4
		});
		
        
		stressHigh = lifeCenter.path().attr({
		    "stroke": "#0d4876",
		    "stroke-width": 40,
		    "cursor":"pointer",
		    "fill":"#0d4876",
		    arc: [125, 125, -2, 1, 6, 105]
		}).click(function () {
            self.setStressPin('high');
         }).touchstart(function() {
         	self.setStressPin('high');
         });
         
        
        
		stressMedium = lifeCenter.path().attr({
		    "stroke": "#248fe0",
		    "stroke-width": 40,
		    "cursor":"pointer",
		    arc: [125, 125, -1, 1, 6, 105]
		}).click(function () {
            self.setStressPin('medium');
         }).touchstart(function() {
         	self.setStressPin('medium');
         });
		stressLow = lifeCenter.path().attr({
		    "stroke": "#42c8bb",
		    "stroke-width": 40,
		    "cursor":"pointer",
		    arc: [125, 125, 0, 1, 6, 105]
		}).click(function () {
            self.setStressPin('low');
         }).touchstart(function() {
         	self.setStressPin('low');
         });
		
		/*
		stressHighText = lifeCenter.text(32,50,"压力山大")
        .attr({
	        "font-size":"10px",
	        "fill":"#FFF",
	        "cursor":"pointer",
	        "transform":"r-60 32 50"
        }).click(function () {
            self.setStressPin('high');
         });
        stressMediumText = lifeCenter.text(125,10,"压力适中")
        .attr({
	        "font-size":"10px",
	        "cursor":"pointer",
	        "fill":"#FFF"
        }).click(function () {
            self.setStressPin('medium');
         });
        stressLowText = lifeCenter.text(168,50,"轻轻松松")
        .attr({
	        "font-size":"10px",
	        "cursor":"pointer",
	        "fill":"#fff",
	        "transform":"r60 168 50"
        }).click(function () {
            self.setStressPin('low');
         });
        */
		this.stressPin = lifeCenter.path("M125 125L125 20").attr({
			 "stroke": "#ccc",
			 "stroke-width": 8,
			 "stroke-dasharray":"-",
			 "arrow-end":"classic"
		});
		this.stressPinRoot = lifeCenter.circle(125,125,10).attr({
			"fill": "#ccc",
			"stroke-width":0
		});
		
		if ( this.model.isAnswered(28) ) {
			var stressAnswer = this.model.getAnswerDegree(28);
			if ( stressAnswer == 1 ) {
				this.setStressPin('high');
			} else if ( stressAnswer == 2 ) {
				this.setStressPin('medium');
			} else {
				this.setStressPin('low');
			}
		}
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
			deltaX = deltaX +125;
		} else {
			deltaX = deltaX - 125;
		}
			
		if ( deltaY > 0 ) {
			deltaY += 125;
		} else {
				
			deltaY -= 125;
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
				
				this.setStressPin('high');
			} else if ( workIconCount < playIconCount )  {
				$('#life-type').html("天生爱玩客");
				this.setStressPin('low');
			} else {
				$('#life-type').html("平衡生活家");
				this.setStressPin('medium');
			}
		} else {
			$('#life-type').html("无聊的生活");
			this.setStressPin('medium');
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
        
        this.trigger("render");
         _hmt.push(['_trackPageview', '/Survey/4']);
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
        app.Router.navigate("Survey/" + nextView.model.get("scene_id"));
        this.onexit();
       
    },
    prev : function() {
        var prevView = app.Views.HairQualityView;
        AppFacade.setCurrentView(prevView);
        app.Router.navigate("Survey/" + prevView.model.get("scene_id"));
        this.onexit();
    },
    postrender: function () {
        AnimationHandler.initialize('#scene-life-content');
        this.animateIn();
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
    },
    onexit : function() {
    	$('.help').hide();
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
        this.model.setAnswer(parseInt(item.parent().parent().data("question-id")), parseInt(item.data("answer-id") ), item.hasClass('selected'));
    },
    animateIn: function () {
        AnimationHandler.animateIn();
    },
    dayShower : function(event) {
        var item = $(event.currentTarget);
		item.toggleClass('selected');
		if( $('.shower-time-icon.selected').size() < 1 ) {
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
    initShowerFreq: function() {
	    var item = $('#shower-frequency');
	    var questionId = parseInt(item.attr('data-question-id'));
	    var degree = this.model.getAnswerDegree(questionId);
	    if ( degree > 0 ) {
		    item.data('degree',degree);
		    item.attr('data-degree',degree+'');
		    
		    item.find('#shower-frequency-text').text(this.model.getAnswerTextByDegree(questionId,degree));
		    this.showShowerWater(degree);
		    
	    }
	    
    },
    render: function () {
    	//default select shampoo
        this.model.setAnswer(10,39,true);
        
        this.$el.html(Mustache.render(this.template, this.model));
        this.initAnswerTooltip();
        _hmt.push(['_trackPageview', '/Survey/7']);
        this.trigger("render");
        return this;
    },
    postrender: function () {
        AnimationHandler.initialize('#scene-cleaning-content');
        this.animateIn();
        
        //set shower freq
        this.initShowerFreq();
        if ( $('#cleaning-trash-text').text().length < 1 ) {
	        $('#cleaning-trash-text').text("更换品牌的频率");
        }
    },
    prev : function() {
        var prevView = app.Views.DietView;
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
        var nextView = app.Views.SalonView;
        AppFacade.setCurrentView(nextView);
        app.Router.navigate("Survey/" + nextView.model.get("scene_id"));
        this.onexit();
    },
    onexit : function() {
    	$('.help').hide();
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
        var smallscreen = isSmallScreen();
        var item = event.currentTarget;
        var degreeContent = $(item);
        var degree;
        var degreesCount = parseInt(degreeContent.find('.health-degree-item').size());
        
        if ( smallscreen ) {
        	var pageX;
        	if ( event.pageX ) {
	        	pageX = event.pageX;
        	} else {
	        	pageX = event.originalEvent.changedTouches[0].pageX
        	}
        	
        	degree = Math.ceil((degreeContent.offset().left + degreeContent.width() - pageX) / degreeContent.width() * degreesCount); 
        	
	       
        } else {
	        degree = Math.ceil((degreeContent.offset().top + degreeContent.height() - event.pageY) / degreeContent.height() * degreesCount); 
        }
		if (!degree) {
			degree = 0;
		}
        degree = Math.min(degreesCount, degree);
        degree = Math.max(1, degree);
		
        degreeContent.attr('class', 'health-degree-content').addClass('onDegree-' + degree);
        degreeContent.find('.health-degree-hint').html(degreeContent.find('[data-degree="' + degree + '"]').attr('title'));

        this.model.setAnswerByDegree(parseInt($(item).attr("data-question-id")), degree, true);
    },

    initHealthQuestions: function () {
        var that = this;
		var smallscreen = isSmallScreen();
		var axis = "y";
		if ( smallscreen ) {
			axis = "x";
		}
        this.$el.find('.health-degree-pin').draggable({
            axis: axis,
            containment: "parent",
            stop: function () {

                //calculate the degree base on y position
                var degreeContent = $(this).parent();

                var degreesCount = parseInt(degreeContent.find('.health-degree-item').size());
                var degree;
                if ( smallscreen ) {
	                degree = Math.ceil((degreeContent.offset().left + degreeContent.width() - $(this).offset().left) / degreeContent.width() * degreesCount);
                } else {
	               degree = Math.ceil((degreeContent.offset().top + degreeContent.height() - $(this).offset().top) / degreeContent.height() * degreesCount);
                }
                

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
        _hmt.push(['_trackPageview', '/Survey/5']);
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
        app.Router.navigate("Survey/" + prevView.model.get("scene_id"));
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
        app.Router.navigate("Survey/" + nextView.model.get("scene_id"));
        this.onexit();
    },
    onexit : function() {
    	$('.help').hide();
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
        var item = $(event.currentTarget);
        item.toggleClass('selected');

        this.model.setAnswer(parseInt(item.parent().attr("data-question-id")), parseInt(item.attr("data-answer-id")), item.hasClass('selected'));



    },

    answerFruitQuestion: function (event) {
        var item = $(event.currentTarget);
        var questionId = parseInt(item.attr("data-question-id"));
        var degree = parseInt(this.model.getAnswerDegree(questionId));
        if (degree) {
	        degree = degree + 1;
	        if ( degree > 4 ) {
		        degree = 1;
	        }
	        
        } else {
	        degree = 1;
        }
        item.attr('class', 'fruit refrigerator-cell width-large height-medium selected fruit-degree-' + degree).attr('data-degree', degree);
        /*
        var width = $(item).width();
        var degree = Math.max(Math.min(Math.floor((event.pageX - $(item).offset().left) / width * 4), 3), 0);
        $(item).attr('data-degree', degree);
        $(item).removeClass('fruit-degree-0').removeClass('fruit-degree-1').removeClass('fruit-degree-2').removeClass('fruit-degree-3').addClass('fruit-degree-' + degree).addClass('selected');
        */
        $('#hint-fruit').text(this.model.getAnswerTextByDegree(questionId,degree));
        this.model.setAnswerByDegree(questionId, degree, true);

    },

    answerDrinkQuestion: function (event) {
        var item = $(event.currentTarget);
        item.toggleClass('selected');
        this.model.setAnswer(parseInt(item.parent().attr("data-question-id")), parseInt(item.attr("data-answer-id")), item.hasClass('selected'));

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
			  		item.flyToAndHide($("#character-container"),function(){
				  		$("#cooking-hat").addClass("selected");
				  		$("#takeaway,#homemade,#diningTable,#cooking-apron").removeClass("selected");
			  		});
			  	break;
			  	case 2:
			  		
			  		item.flyToAndHide($("#character-container"),function(){
				  		$("#cooking-apron").addClass("selected");
				  		$("#takeaway,#homemade,#diningTable,#cooking-hat").removeClass("selected");
			  		});
			  	break;
			  	case 3:
			  		item.flyToAndHide($("#homemade"),function(){
				  		$("#homemade").addClass("selected");
				  		$("#takeaway,#cooking-apron,#cooking-hat").removeClass("selected");
				  		$("#diningTable").addClass("selected");
			  		});
			  	break;
			  	case 4:
			  		item.flyToAndHide($("#takeaway"),function(){
				  		$("#takeaway").addClass("selected");
				  		$("#homemade,#cooking-apron,#cooking-hat").removeClass("selected");
				  		$("#diningTable").addClass("selected");
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
        this.$el.find('.drink,.taste,.fruit,.cooking').tooltip();
    },
    initFruit: function () {
        var self = this;

        /*
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
        */
    },

    initialize: function () {
        this.$el = $('#main');
        this.on("render", this.postrender);
        this.on("beginRender", this.render);
    },

    // Re-render the titles of the todo item.
    render: function () {
    	
    	this.model.gender = app.Views.AvatarView.model.getGender();
        this.$el.html(Mustache.render(this.template, this.model));
		app.Views.AvatarView.render();
        this.initQuestionHint();
        this.initAnswerTooltip();
        this.initFruit();
		_hmt.push(['_trackPageview', '/Survey/6']);
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
        app.Router.navigate("Survey/" + prevView.model.get("scene_id"));
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
        app.Router.navigate("Survey/" + nextView.model.get("scene_id"));
        this.onexit();
    },
    onexit : function() {
	    $("#character-container").fadeOut();
	    $('.help').hide();
	    $("#cooking-apron,#cooking-hat").hide();
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
        "click #haircolor-red,#haircolor-gold,#haircolor-black,#haircolor-mix" : "setHairColor",
        "click #hand,#pin,#band,#comb" : "setHairState",
        "click .hairstyle-circle-overlay" : "setHairCircle"
    },
	drawHairCircleArc: function() {
		var lengthPaper = Raphael("hairstyle-length-control", 200, 200);
		lengthPaper.customAttributes.arc = drawArc;
		var curlPaper = Raphael("hairstyle-curl-control", 200, 200);
		curlPaper.customAttributes.arc = drawArc;
		
		
		lengthPaper.path().attr({
		    "stroke": "#38a4ee",
		    "stroke-width": 20,
		    "cursor":"pointer",
		    arc: [100, 100, 0, 1, 5, 85]
		});
         lengthPaper.path().attr({
		    "stroke": "#073351",
		    "stroke-width": 20,
		    "cursor":"pointer",
		    arc: [100, 100, 1, 1, 5, 85]
		}).touchstart(function (x) {
           
         });
         lengthPaper.path().attr({
		    "stroke": "#0b4d7b",
		    "stroke-width": 20,
		    "cursor":"pointer",
		    arc: [100, 100, 2, 1, 5, 85]
		});
         lengthPaper.path().attr({
		    "stroke": "#165986",
		    "stroke-width": 20,
		    "cursor":"pointer",
		    arc: [100, 100, 3, 1, 5, 85]
		});
         lengthPaper.path().attr({
		    "stroke": "#2470a4",
		    "stroke-width": 20,
		    "cursor":"pointer",
		    arc: [100, 100, 4, 1, 5, 85]
		});
         
         curlPaper.path().attr({
		    "stroke": "#ffe579",
		    "stroke-width": 20,
		    "cursor":"pointer",
		    arc: [100, 100, 0.8, 1, 4, 85]
		}).click(function () {
            
         });
         curlPaper.path().attr({
		    "stroke": "#ffcc61",
		    "stroke-width": 20,
		    "cursor":"pointer",
		    arc: [100, 100, 1.8, 1, 4, 85]
		}).click(function () {
            
         });
         curlPaper.path().attr({
		    "stroke": "#fbad09",
		    "stroke-width": 20,
		    "cursor":"pointer",
		    arc: [100, 100, 2.8, 1, 4, 85]
		}).click(function () {
            
         });
         curlPaper.path().attr({
		    "stroke": "#e49b02",
		    "stroke-width": 20,
		    "cursor":"pointer",
		    arc: [100, 100, 3.8, 1, 4, 85]
		}).click(function () {
            
         });
	
	},
    initHairCircle : function() {
        var self = this;
        
        this.drawHairCircleArc();
        
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
		
		

		if ( !this.model.isAnswered(13) ) {
			length.parent().find('.hairstyle-text').html('请选择');
		}
		if ( !this.model.isAnswered(14) ) {
			curl.parent().find('.hairstyle-text').html('请选择');
		}
		

		
		
		$('#hairstyle-length .hairstyle-circle-dragable,#hairstyle-curl .hairstyle-circle-dragable').draggable({
			start: function(event,ui){

			},
			drag: function(event,ui) {
				if (!event.pageX ) {
		        	event.pageX = event.originalEvent.changedTouches[0].pageX;
		        	event.pageY = event.originalEvent.changedTouches[0].pageY;
	        	}
				var data = $( this ).data('dragcircle'),
                angle = Math.atan2( event.pageX - data.centerX - data.startX, event.pageY - data.centerY - data.startY );
                data.angle = angle;
                ui.position.top = data.centerY + Math.cos( angle )*data.radius;
                ui.position.left = data.centerX + Math.sin( angle )*data.radius;
                $(this).rotate(angle);
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
        var $circle = $(event.currentTarget).parent();
		var data = $circle.find('.hairstyle-circle-dragable').data('dragcircle');
		if ( !event.pageX ) {
		        	event.pageX = event.originalEvent.changedTouches[0].pageX;
		        	event.pageY = event.originalEvent.changedTouches[0].pageY;
		        	 
	    }
	   

        angle = Math.atan2( event.pageX - data.centerX - data.startX, event.pageY - data.centerY - data.startY );
        
        data.angle = angle;
		$circle.find('.hairstyle-circle-dragable').data('dragcircle', data );
        $circle.find('.hairstyle-circle-dragable').setDegree();
        
        var question_id = parseInt($circle.parent().data("question-id"));
		var degree = parseInt($circle.find('.hairstyle-circle-dragable').data('degree'));
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
        _hmt.push(['_trackPageview', '/Survey/2']);
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
	    $('.help').hide();
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
		_hmt.push(['_trackPageview', '/Survey/3']);
        this.trigger("render");
        return this;
    },

    postrender: function () {
        AnimationHandler.initialize('#scene-hairquality-content');
        var self = this;
        
        $('.quality-progree-draggable').each(
        	function(){
	        	var question = parseInt($(this).parent().attr('data-question-id'));
	        	if ( ! self.model.isAnswered(question) ) {
		        	$(this).html('请选择');
	        	}
        	}
        );
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
	    $('.help').hide();
	    AnimationHandler.animateOut("next", function () { AppFacade.getCurrentView().render(); });
	    AppFacade.saveToCookie();
    },
    onClickProgressBar : function(e) {
	  var bar = $(e.currentTarget);
	  if ( !e.pageX ) {
		        	e.pageX = e.originalEvent.changedTouches[0].pageX;
		        	e.pageY = e.originalEvent.changedTouches[0].pageY;
	   }
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
		    
		    
		}
	    this.setFacialExpression();

    },
    setFacialExpression : function() {
	    
	    var problemCount = this.$el.find('.hairproblem-1-selected,.hairproblem-2-selected,.hairproblem-3-selected,.hairproblem-4-selected,.hairproblem-5-selected').size();
	    if ( problemCount > 2 ) {
		    app.Views.AvatarView.sad();
	    } else {
	    	app.Views.AvatarView.smile();
		    app.Views.AvatarView.startBlink();
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
        "click .age-item" : "setAge"
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
        _hmt.push(['_trackPageview', '/Survey/1']);
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
    	$('#navigation,#help-switch').hide();
    	AnimationHandler.animateOut("next", function () { AppFacade.initSplash(); });
    	
    },
    onexit : function() {
    	$('.help').hide();
	    $("#character-container").fadeOut();
	    $('#prev').fadeIn();
	    $('#init-help').hide();
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
        this.$el.find('#career-clothes .clothes').tooltip();
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
       "click #hairStyleRef .chat-icon" : "onClickChatIcon",
       "click #chat-icon-perm .chat-icon,#chat-icon-care .chat-icon" : "onClickChatDegree",
       "click #counselor-chat-4" : "next"
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
        _hmt.push(['_trackPageview', '/Survey/8']);
        this.trigger("render");
        return this;
    },
    postrender: function () {
        AnimationHandler.initialize('#scene-salon-content');
        
       
        this.animateIn();
        
		if ( this.model.isAnswered(25) ) {
			 $('#counselor-chat-1').fadeIn();
		 } else {
			 $('#counselor-chat-1').fadeIn();
		 }
		 if ( this.model.isAnswered(26) ) {
			 $('#counselor-chat-2').fadeIn();
		 }
		 if ( this.model.isAnswered(27) ) {
			 $('#counselor-chat-3').fadeIn();
			 $('#counselor-chat-4').fadeIn();
		 }
    },
    prev: function () {
        var prevView = app.Views.CleaningView;
        AppFacade.setCurrentView(prevView);
        app.Router.navigate("Survey/" + prevView.model.get("scene_id"));
        this.onexit();
    },
    onexit : function() {
    	$('.help').hide();
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
        AppFacade.submitAnswer();
    	
        
    },
    onClickChatIcon: function(event) {
	    var icon = $(event.currentTarget);
	    var isSelected = icon.hasClass('selected');
	    icon.toggleClass('selected');
	    this.model.setAnswer( parseInt(icon.parent().attr('data-question-id')), parseInt(icon.attr('data-answer-id')),!isSelected);
		 $('#counselor-chat-2').fadeIn();

		 

    },
    onClickChatDegree: function(event) {
    	var icon = $(event.currentTarget).parent();
    	var question_id = parseInt(icon.attr('data-question-id'));
    	var degree = this.model.getAnswerDegree(question_id);
    	if (degree == 5) {
	    	degree = 1;
    	} else {
	    	degree = degree + 1;
    	}
       	this.model.setAnswerByDegree(question_id, degree, true);
    	icon.attr('class','on-degree-' + degree);
    	icon.find('.chat-icon-text').html(this.model.getAnswerTextByDegree(question_id,degree));
	    if ( this.model.isAnswered(26) ) {
			 $('#counselor-chat-3').fadeIn();
		 }
		 if ( !isSmallScreen() && this.model.isAnswered(27) ) {
			 $('#counselor-chat-4').fadeIn();
		 }
    }
});