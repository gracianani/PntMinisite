var BasicFrameView = function(){
	this.init();
};
BasicFrameView.prototype = {
	init : function() {
		var self = this;
		this.progressBar = $("#progress");
		this.step = 1;
		
		
		this.smallAvatar = $("#profile-avatar .avatar");
		var paper = new Raphael(this.smallAvatar[0]);
		paper.path(default_avatar_path).attr({fill: "#FFF", stroke: "none"});
		
		
		$('#logo').show().animate({path : new $.path.bezier({
                start: {
                    x: -300,
                    y: 20,
                    angle: 0
                },
                end: {
                    x: 20,
                    y: 10,
                    angle: 0,
                    length: 0.25,
                    easing: "easeOutQuint"
                }
            })}, 800, "easeOutQuint", function() {
            			$('#siteTitle').show();
            		//$('#siteTitle').show().animate({top:15},500,function(){
            			$('#profile').show().animate({top:20},500);
            			$('#footer').show().animate({bottom:'0'},500); 
            			$('#progress,#main,#navigation').fadeIn();
            			
            			window.AppFacade.enterDietScene();
            		//});
            		         
					
					
						
		});
		
		



		
		
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
		
		setTimeout(this.onExitLoading, 3000);
		
	},
	onExitLoading : function() {
		$('#loading').fadeOut('slow');
		window.AppFacade.initBasicFrame();
	}
};
