

var ReportView = Backbone.View.extend({
    //... is a list tag.
    tagName: "div",
    id: "report",
    className: "container",
    // Cache the template function for a single item.
    template: $('#report-template').html(),

    events: {
        "click .restartQuiz": "onClickRestart",
        "click #report-product-more": "onClickMoreProduct"
    },

    initialize: function () {
        this.$el = $('#report');
        this.on("finishloading", this.render);
        this.on("saveReportComplete", this.onSaveReportComplete);
        this.on("render", this.postRender);        

    },

    // Re-render the titles of the todo item.
    render: function () {
        AppFacade.exitLoading();
        this.$el.html(Mustache.render(this.template, this.model));
        app.Views.AvatarView.render();
        this.trigger("render");
        this.setShareConfig();
        _hmt.push(['_trackPageview', '/Report']);
        
        return this;
    },
    postRender: function () {
        AnimationHandler.animateOut("report", function () {
        	$('#share').hide();
        	$('#profile').hide();
            $("#main").fadeOut(function () {
                $("#splash").fadeOut(function () {
                    $('#report').fadeIn(
            	    function () {
            	        
            	        $('.report-product-item:first').addClass('current');
            	        
            	    });
                });
            });
        });
        
        if ( app.ReportLogged ) {
	        $('.restartQuiz,#report-mobile-restart').html('<i class="icon-refresh icon-white"></i>重新测试');
	        $('#report-mobile-restart').html('<i class="icon-refresh icon-white"></i>重新测试');
        } else {
	        $('.restartQuiz,#report-mobile-restart').html('<i class="icon-beaker icon-white"></i>我来试试');
	        $('#report-mobile-restart').html('<i class="icon-beaker icon-white"></i>我来试试');
        }
        this.showProgress();
        
        $(window).bind('scroll',function(){
        	var scrollTop = $(window).scrollTop();
        	var btn = $('#report-flyToTop');
        	if ( scrollTop > 870 && btn.is(':hidden') ) {
	        	btn.fadeIn();
        	} else {
        		if ( scrollTop < 870 && btn.is(':visible') )  {
	        		btn.fadeOut();
        		}
	        	
        	}
        });
        
        if ( this.model.Score < 60 ) {
	         $("#report-avatar").find('.face').attr('class', 'face face-' + app.Views.AvatarView.model.gender + '-3');
        }
    },
    onexit: function () {
        this.resetShareConfig();
        /*
        if ( app.originUserAnswers && !app.ReportLogged ) {
	        //恢复原来的报告纪录
	        AppFacade.revertCookieAnswer(app.originUserAnswers);
        }
        */
        $('#profile').show();
        $('#report-share').hide();
        $('#report-flyToTop').hide();
        $('#report-mobile-bar').hide();
	    $(window).unbind('scroll');
        $('#report').fadeOut(function () {
            $('#main').fadeIn(function () {
                $('#progress,#main,#navigation,#footer,#help-switch').fadeIn();
                AppFacade.getCurrentView().render();
                $('#share').show();
            });

        }
	    );
	    
    },
    onClickRestart: function () {
    	/*
    	if ( app.originUserAnswers ) {
			AppFacade.setUserAnswers(app.originUserAnswers);
		}
		*/
        AppFacade.gotoScene(1);
        app.ReportLogged = false;
        app.ReportId = undefined;
    },
    showProgress: function () {
        var progressbar = $('#progressbar');
        var progressLabel = $('#progressbar .progress-label');
        progressbar.show();
        progressbar.progressbar({
			value: 0,
			change: function() {
		        progressLabel.text('大约需要10秒时间，请耐心等待' );
		     },
		     complete: function() {
			    progressLabel.text('服务器在努力中，请不要离开' ); 
		     }
		});
		var counter = 0;
		var timer = setInterval(function(){
			counter ++ ;
			progressbar.progressbar( "value", counter);
			if (counter == 100 ) {
				clearInterval(timer);
			}
		}, 100);
		
        
    },
    onSaveReportComplete: function() {
	    $('#progressbar').hide();
	    $('.downloadQuizImg').css('display','block');
	    $('#report-share').show();
	    if (isSmallScreen() ) {
		    $('#report-mobile-bar').show();
	    }
	    $('#downloadQuizText').hide();
	    var shareImg = "http://pantene.app.social-touch.com/reports/report_" + app.ReportId + ".png";
	    $('.downloadQuizImg').attr('href',shareImg);
	    $('#report-mobile-download').attr('href',shareImg);
	    jiathis_config.pic = shareImg;
    },
    onClickDownload: function(e) {
	    
    },
    onClickMoreProduct: function () {
        var current = this.$el.find('#report-product-list .current');
        var next = current.next();
        if (next.size() < 1) {
            next = this.$el.find('.report-product-item:first');
        }
        next.css('z-index', '2');
        next.fadeIn(function () {
            current.removeClass('current');
            next.addClass('current').attr('style', '');
        });
    },
    setShareConfig: function () {

        var summary = "刚刚玩了@潘婷Pantene 的小测试" + this.model.ShareText + " 我的“秀发健康指数”是 " + this.model.Score +
    	"，" + this.model.ScoreTitle + 
    	"！" + this.model.ShareText2 + "你的头发能得多少分？快来跟我PK吧！";
		
		var title = "我的秀发分数是 " + this.model.Score + "！求击败 O(∩_∩)O~-潘婷护发实验室";
    	
        var shareimg = "http://pantene.app.social-touch.com/reports/report_" + app.ReportId + ".png";
        jiathis_config = {
            data_track_clickback: true,
            summary: summary,
            desc:summary,
            title: "#探索潘婷护发实验室#",
            pic: shareimg,
            img: shareimg,
            ralateuid: {
                "tsina": "潘婷Pantene"
            },
            appkey: {
                "tsina": "3695496477",
                "tqq": "6b346735b25a53425c4eda8e41553e96"
            },
            shortUrl: false,
            hideMore: true
        }
        $('title').text(title);
    },
    resetShareConfig: function () {
        jiathis_config = defaultShareConfig;
        $('title').text("潘婷护发实验室");
    }
});