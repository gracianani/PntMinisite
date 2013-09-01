var BasicFrameView = function(){
	this.init();
};
BasicFrameView.prototype = {
    init: function () {
        var self = this;
        this.progressBar = $("#progress");
        this.step = 1;
		
		$('#loading').fadeOut();
        $('#logo').show().animate({ path: new $.path.bezier({
            start: {
                x: -300,
                y: 20,
                angle: 0
            },
            end: {
                x: 30,
                y: 10,
                angle: 0,
                length: 0.25,
                easing: "easeOutQuint"
            }
        })
        }, 800, "easeOutQuint", function () {
           
        	window.AppFacade.getCurrentView().render();
        	self.showControls();
        });
        
        
        
        

    },
    showControls : function() {
	    //$('#profile').show().animate({ top: 10 }, 500);
	    $('#siteTitle').show().animate({ top: 10 }, 500, function () {});
	    $('#footer').show().animate({ bottom: '0' }, 500);
	    $('#progress,#main,#navigation').fadeIn();
    }
};

var SplashView = function() {
	this.init();	
};

SplashView.prototype = {
	init: function() {
		var self = this;
		this.splash = $('#splash');
		AnimationHandler.initialize('#splash');
		this.splash.find('.item').css('visibility','visible');
		
		this.splash.find('.splash-gender-female,.splash-gender-male').click(function(){
        	self.splash.fadeOut(function(){
        		self.onExitSplash();
	        	//app.Router.navigate("Survey/1");
	        	//
        	});
	        
        });
        AnimationHandler.animateIn();
	},
	onExitSplash : function() {
		$('#main').show();
		window.AppFacade.initBasicFrame();
	}
};
var LoadingView = function(){
	this.init();
};
LoadingView.prototype = {
	init : function() {
		var self = this;
		this.loading = $('#loading');
		this.body = $('body');
		
		spinner(this.loading[0], 105, 120, 36, 3, "#FFFFFF");
		
		this.body.addClass('loading');
		this.loading.fadeIn('slow',function(){
			self.onExitLoading();
		});
		
		
	},
	onExitLoading : function() {
		$('#loading').fadeOut('slow');
		window.AppFacade.initSplash();
	}
};
