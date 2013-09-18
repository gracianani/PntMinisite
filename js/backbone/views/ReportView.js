

var ReportView = Backbone.View.extend({
    //... is a list tag.
    tagName: "div",
    id: "report",
    className: "container",
    // Cache the template function for a single item.
    template: $('#report-template').html(),

    events: {
        "click #restartQuiz": "onClickRestart",
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
            $("#main").fadeOut(function () {
                $("#splash").fadeOut(function () {
                    $('#report').fadeIn(
            	    function () {
            	        
            	        $('.report-product-item:first').addClass('current');
            	        
            	    });
                });
            });
        });
        //this.model.shareReport();
        //this.showProgress();
    },
    onexit: function () {
        this.resetShareConfig();
        $('#report-share').hide();
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
        AppFacade.gotoScene(1);
        app.ReportLogged = false;
        app.ReportId = 0;
    },
    showProgress: function () {
        var progressbar = $('#progressbar');
        var progressLabel = $('#progressbar .progress-label');
        progressbar.show();
        progressbar.progressbar({
			value: 0,
			change: function() {
		        progressLabel.text('大约需要30秒时间，请耐心等待' );
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
		}, 300);
		
        
    },
    onSaveReportComplete: function() {
	    $('#progressbar').hide();
	    $('#downloadQuizImg').show();
	    $('#report-share').show();
	    $('#downloadQuizText').hide();
	    var shareImg = "http://pantene.app.social-touch.com/reports/report_" + app.ReportId + ".png";
	    $('#downloadQuizImg').attr('href',shareImg);
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
		
        var summary = this.model.ShareText + " 我的“秀发健康指数”是 " + this.model.Score +
    	"，" + this.model.ScoreTitle +
    	"！" + "你的头发能得几分？";

        var shareimg = "http://pantene.app.social-touch.com/reports/report_" + app.ReportId + ".png";
        jiathis_config = {
            data_track_clickback: true,
            summary: summary,
            title: "#Pantene护发实验室#",
            pic: shareimg,
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
    },
    resetShareConfig: function () {
        jiathis_config = defaultShareConfig;
    }
});