

require.config({
    baseUrl: 'js/vendor'
});

requirejs(['../backbone/utils/plugins', '../backbone/models/Avatar', '../backbone/models/Report'],
    function ($, underscore, backbone, mustache, plugin, avatar, report) {
        var app = {
            Models: {},
            Views: {},
            User: {},
            weiboApp: {
                authorize_uri: 'https://api.weibo.com/oauth2/authorize',
                app_id: '3695496477',
                app_secret: '942214d88b57723ad419854c67d3c49c',
                redirect_uri: 'http://pantene.app.social-touch.com/'
            },
            qqApp: {
                authorize_uri: 'https://api.weibo.com/oauth2/authorize',
                app_id: '100516646',
                app_key: '6b346735b25a53425c4eda8e41553e96',
                redirect_uri: 'http://pantene.app.social-touch.com/qc_callback.html'
            }
        };


        var PlainReport = Backbone.Model.extend({
            LifeStyleSuggestions: [],
            HairCareSuggestions: [],
            HairSituationSuggestions: [],
            Score: 0,
            ScoreTitle: "",
            QuizId: 0,
            ScoreSuggestions: [],
            HairProblems: [],
            ProductSuggestions: [],
            ShareText: "",
            BestProduct: [],
            level: "medium",
            getSuggestionText: function () {
                var suggestion = app.SuggestionRepo.findWhere({ suggestion_id: parseInt(this) });
                return suggestion.get("suggestion_text");
            },
            getSuggestionType: function () {
                var suggestion = app.SuggestionRepo.findWhere({ suggestion_id: parseInt(this) });
                return suggestion.get("type");
            },
            fillSuggestions: function (suggestions) {
            /*
                this.LifeStyleSuggestions = suggestions.lifestyle_suggestions;
                this.HairCareSuggestions = suggestions.haircare_suggestions;
                this.HairSituationSuggestions = suggestions.hairsituation_suggestions;
                this.Score = suggestions.score;
                this.Ranking = suggestions.ranking;
                var gSuggestion = app.GeneralSuggestionRepo.findWhere({ g_suggestion_id: 1 });

                if (suggestions.score > 50 && suggestions.score < 80) {
                    gSuggestion = app.GeneralSuggestionRepo.findWhere({ g_suggestion_id: 2 });
                }
                else if (suggestions.score >= 80) {
                    gSuggestion = app.GeneralSuggestionRepo.findWhere({ g_suggestion_id: 3 });
                }
                this.ShareText = gSuggestion.get("share_text_begin_with");
                this.level = gSuggestion.get("g_level");
                this.ScoreTitle = gSuggestion.get("suggestion_title");
                this.ScoreSuggestions.push(gSuggestion.get("suggestion_text"));
                this.QuizId = suggestions.quizId;

                var productIds = suggestions.suggested_products.split(",");
                for (var i = 0; i< 3 && i < productIds.length; i++) {
		            var suggestion = app.ProductRepo.findWhere({
		                product_id: parseInt(productIds[i])
		            });
		            if (typeof suggestion !== 'undefined') {
		                this.ProductSuggestions.push(suggestion.toJSON());
		            }
		        }
		       */
		        this.problem_bald=[];
		        this.problem_scurf=[];
		        this.problem_dry=[];
		        this.stress=[];
		        this.cook=[];
		        this.taste=[];
		        this.mealcount=[];
		        this.sleep=[];
		        this.salon=[];
		        this.cleaning=[];
		        this.style=[];
		        this.hair_color=[];
		        this.hair_curl=[];
		        this.sun=[];
		        this.keywords=[];
				this.LifeStyleSuggestions = suggestions.lifestyle_suggestions;
		        this.HairCareSuggestions = suggestions.haircare_suggestions;
		        this.HairSituationSuggestions = suggestions.hairsituation_suggestions;
				this.fillSuggestionGroup(suggestions);
		        this.Score = suggestions.score;
		        this.Ranking = suggestions.ranking;
		
		        var gSuggestion = app.GeneralSuggestionRepo.findWhere({ g_suggestion_id: 1 });
				if (suggestions.score > 50 && suggestions.score < 60) {
		            gSuggestion = app.GeneralSuggestionRepo.findWhere({ g_suggestion_id: 2 });
		        }
		        if (suggestions.score >= 60 && suggestions.score < 80) {
		            gSuggestion = app.GeneralSuggestionRepo.findWhere({ g_suggestion_id: 3 });
		        }
		        else if (suggestions.score >= 80) {
		            gSuggestion = app.GeneralSuggestionRepo.findWhere({ g_suggestion_id: 4 });
		        }
		        this.level = gSuggestion.get("g_level");
		        this.ScoreTitle = gSuggestion.get("suggestion_title");
		        this.ScoreSuggestions.push(gSuggestion.get("suggestion_text"));
		        this.QuizId = suggestions.quizId;
		
		        var productIds = suggestions.suggested_products.split(",");
		        productIds = unique(productIds);
		        for (var i = 0; i< 3 && i < productIds.length; i++) {
		            var suggestion = app.ProductRepo.findWhere({
		                product_id: parseInt(productIds[i])
		            });
		            if (typeof suggestion !== 'undefined') {
		                this.ProductSuggestions.push(suggestion.toJSON());
		            }
		        }

            },
		    fillSuggestionGroup: function(suggestions) {
		    	var i, suggestion,key;
		    	allSuggestions = [].concat(suggestions.lifestyle_suggestions).concat(suggestions.haircare_suggestions).concat(suggestions.hairsituation_suggestions);
			    for ( i = 0; i < allSuggestions.length; i++ ) {
			    
			    	for ( var j = 0; j < allSuggestions[i].suggestion_ids.length; j++ ) {
				    	suggestion = app.SuggestionRepo.findWhere({ suggestion_id: parseInt(allSuggestions[i].suggestion_ids[j]) });
				    	
				    	if (! this[suggestion.get("type")] ) {
							 this[suggestion.get("type")]  = [];
						}
						key = suggestion.get("keyword");
						if (key ) {
							 this["keywords"].push(key);
						}
						 this[suggestion.get("type")].push(suggestion.toJSON());
					    }
			    	}
				    this.taste = this.taste.slice(0,2);
				 
		    },
            fillAvatar: function (options) {
                this.gender = options.gender;
                this.hairLength = options.hairLength;
                this.career_id = options.career_id;
                this.hairCurly = options.hairCurly;
                this.hairColor = options.hairColor;
                this.hairType = options.hairType;
            },
            saveReportImage: function (reportId) {
                var self = this;
                var $ = (jQuery);
                $.ajax({
                    type: "POST",
                    url: 'WeiboWebServices.asmx/FetchReport',
                    timeout: 5000,
                    data: '{ report_id : ' + reportId + '}',
                    datatType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (data) {
                        self.fillSuggestions($.parseJSON(data.d).suggestions);
                        self.fillAvatar($.parseJSON(data.d).avatar);
                        $("#report").html(Mustache.render($('#report-template').html(), self));
                        $('.report-product-item:first').addClass('current');
                        $("#report").append("<div id='loadCompleteFlag'></div>");

                         
                        if ( self.Score < 60 ) {
	                       $("#report-avatar").find('.face').attr('class', 'face face-' + self.gender + '-3');
                        }
                    }
                });
            }
        });

        app.SuggestionRepo = new SuggestionsCollection;
        app.ProductRepo = new ProductsCollection;
        app.GeneralSuggestionRepo = new GeneralSuggestionsCollection;

        app.SuggestionRepo.fetch().done(function () {
            app.ProductRepo.fetch().done(function () {
                app.GeneralSuggestionRepo.fetch().done(function () {
                    app.PlainReport = new PlainReport;
                    var reportId = getParameterByName("reportId");
                    if (reportId != "") {
                        app.PlainReport.saveReportImage(reportId);
                    }
                });
            });

        });


    });

   
        