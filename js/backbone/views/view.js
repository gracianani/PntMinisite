var BasicFrameView = function(){
	this.init();
};
BasicFrameView.prototype = {
    init: function () {
        var self = this;
        this.progressBar = $("#progress");
        this.step = 1;

        $('#loading').fadeOut();
       
            if ( AppFacade.getCurrentView() != app.Views.ReportView ) {
                window.AppFacade.getCurrentView().render();
                self.showControls();
                app.Views.MainView.setProgressBar();
            }

    },
    showControls: function () {
        //$('#profile').show().animate({ top: 10 }, 500);
        $('#footer').show().animate({ bottom: '0' }, 500);
        $('#progress,#main,#navigation,#help-switch').fadeIn();
    },
    showReport: function () {
        $('#progress,#main,#navigation,#footer,#help-switch').fadeOut();
    }
};

var SplashView = function() {
	this.init();	
};

SplashView.prototype = {
	init: function() {
	

		var self = this;
		this.splash = $('#splash');
		this.splash.fadeIn('fast', function(){
			AnimationHandler.initialize('#splash');
			self.splash.find('.item').css('visibility','visible');
			AnimationHandler.animateIn();
		});
		
		
		this.splash.find('.splash-gender-female,.splash-gender-male').on("click",function(){
			var answerId = parseInt($(this).attr('data-answer-id'));
			app.Views.BasicInfoView.model.setAnswer(22, answerId, true);
			app.Views.AvatarView.model.setGender();
			
        	self.splash.fadeOut(function(){
        		self.onExitSplash();
				
        	});
	        
        });
        
        _hmt.push(['_trackPageview', '/splash']);
	},
	onExitSplash : function() {
		$('#main').show();
		this.splash.fadeOut();
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
		this.content = this.loading.find('#loading-content');
		this.body = $('body');
		
		spinner(this.content[0], 105, 120, 36, 3, "#FFFFFF");
		
		this.body.addClass('loading');
		this.loading.fadeIn('slow');
		_hmt.push(['_trackPageview', '/loading']);
		
		
	},
	onExitLoading : function() {
		this.loading.fadeOut('slow');
		
	    $('body').removeClass('loading');
	   
		window.AppFacade.setStartView();
		window.AppFacade.initQQLogin();
        window.AppFacade.initWbLogin();
	}
};
