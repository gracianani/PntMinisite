var BasicFrameView = function(){
	this.init();
};
BasicFrameView.prototype = {
    init: function () {
        var self = this;
        this.progressBar = $("#progress");
        this.step = 1;
		AnimationHandler.initialize('#splash');
		$('#splash .item').css('visibility','visible');
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
            $('#siteTitle').show().animate({ top: 10 }, 500, function () {});

        });
        
        $('.splash-gender-female,.splash-gender-male').click(function(){
        	$('#splash').fadeOut(function(){
        		$('#main').show();
        		window.AppFacade.getCurrentView().render();
	        	app.Router.navigate("Survey/1");
	        	self.showControls();
        	});
	        
        });
        AnimationHandler.animateIn();
        
        

    },
    showControls : function() {
	    //$('#profile').show().animate({ top: 10 }, 500);
	    $('#footer').show().animate({ bottom: '0' }, 500);
	    $('#progress,#main,#navigation').fadeIn();
    }
};


var LoadingView = function(){
	this.init();
	this.loading;
	this.body;
};
LoadingView.prototype = {
	init : function() {
		var self = this;
		this.loading = $('#loading');
		this.body = $('body');
		
		spinner(this.loading[0], 100, 105, 36, 3, "#FFFFFF");
		
		this.body.addClass('loading');
		this.loading.fadeIn('slow');
		
		setTimeout(this.onExitLoading, 2000);
		
	},
	onExitLoading : function() {
		$('#loading').fadeOut('slow');
		//window.AppFacade.initBasicFrame();
	}
};
