
var app = app || {};

var Report = Backbone.Model.extend({
    LifeStyleSuggestions: [],
    HairCareSuggestions: [],
    HairSituationSuggestions: [],
    Score: 0,
    ScoreTitle: "",
    QuizId: 0,
    ScoreSuggestions: [],
    ProductSuggestions: [],
    ShareText: "",
    level: "medium",
    clearSuggestions: function () {
        this.LifeStyleSuggestions = [];
        this.HairCareSuggestions = [];
        this.HairSituationSuggestions = []
        this.Score = 0;
        this.ScoreTitle = "";
        this.QuizId = 0;
        this.ScoreSuggestions = [];
        this.ProductSuggestions = [];
        this.ShareText = "";
        this.level = "medium";
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
    },
    loadSuggestions: function (suggestions) {
        this.clearSuggestions();
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
        this.ShareText = gSuggestion.get("share_text_begin_with");
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

        AppFacade.setCurrentView(app.Views.ReportView);
        app.Router.navigate("Report/" + this.QuizId);
        app.ReportId = this.QuizId;
        app.Views.ReportView.trigger("finishloading");

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
    getSuggestionText: function () {
        var suggestion = app.SuggestionRepo.findWhere({ suggestion_id: parseInt(this) });
        return suggestion.get("suggestion_text");
    },
    getSuggestionType: function () {
        var suggestion = app.SuggestionRepo.findWhere({ suggestion_id: parseInt(this) });
        return suggestion.get("type");
    },
    saveAnswer: function (callback) {
        var requestData = '{ user_answers : \"' + JSON.stringify(AppFacade.getUserAnswers()).replace(/"/g, '\'') + '\", quizId : 0 , str_user : \"' + JSON.stringify(app.User).replace(/"/g, '\'') + ' \" }';
        var self = this;

        $.ajax({
            type: "POST",
            url: 'WeiboWebServices.asmx/LogAnswer',
            timeout: 5000,
            data: requestData,
            datatType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                app.ReportId = $.parseJSON(data.d).quizId;
                callback();
            }
        });
    },
    getReport: function () {
        var userAnswers = AppFacade.getUserAnswers();
        var stringyfied = JSON.stringify(userAnswers).replace(/"/g, '\'');
        var requestData = '{ user_answers : \"' + stringyfied + '\", quizId : ' + app.ReportId + ', str_user : \"' + JSON.stringify(app.User).replace(/"/g, '\'') + ' \" }';
        if (typeof (app.ReportId) == 'undefined') {
            requestData = '{ user_answers : \"' + stringyfied + '\", quizId : 0 , str_user : \"' + JSON.stringify(app.User).replace(/"/g, '\'') + ' \" }';
        }
        var self = this;

        $.ajax({
            type: "POST",
            url: 'WeiboWebServices.asmx/GetSuggestions',
            timeout: 5000,
            data: requestData,
            datatType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                self.loadSuggestions($.parseJSON(data.d));
                self.shareReport();
            }
        });


    },

    shareReport: function () {
        var avatar = app.Views.AvatarView.model;
        gender = avatar.gender;
        color = avatar.hairColor;
        $.ajax({
            type: "POST",
            url: 'WeiboWebServices.asmx/Share',
            timeout: 20000,
            data: '{ report_id :' + app.ReportId + '}',
            datatType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                app.Views.ReportView.trigger("saveReportComplete");
            },
            timeout: function () {
                alert("请求超时，请稍后再试");
                window.location.reload();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                alert("很抱歉，生成请求失败了");
                window.location.reload();

            }
        });
    },

    getReportByReportId: function (reportId) {
        var self = this;
        $.ajax({
            type: "POST",
            url: 'WeiboWebServices.asmx/FetchReport',
            timeout: 5000,
            data: '{ report_id : ' + reportId + '}',
            datatType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {

                var response = $.parseJSON(data.d);
	            AppFacade.setUserAnswers($.parseJSON(data.d).user_answers);
				AppFacade.saveToCookie();
                
                app.ReportId = reportId;
                self.loadSuggestions(response.suggestions);
                self.shareReport();
            },
            timeout: function () {
                alert("请求超时，请稍后再试");
                AppFacade.handleError("timeout");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("没有您想找的测试报告，现在带您进入实验室");
                AppFacade.handleError("notfound");
            }
        });
    },

    getReportByUserId: function (user) {
        var self = this;
        if (typeof (user) == 'undefined') {
            user = app.User;
        }
        $.ajax({
            type: "POST",
            url: 'WeiboWebServices.asmx/FetchReportByUser',
            timeout: 5000,
            data: '{ str_user : \"' + JSON.stringify(user).replace(/"/g, '\'') + ' \" }',
            datatType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                app.ReportId = $.parseJSON(data.d).report_id;
                self.shareReport();
                AppFacade.setUserAnswers($.parseJSON(data.d).user_answers);
                AppFacade.saveToCookie();
                self.loadSuggestions($.parseJSON(data.d).suggestions);
            },
            timeout: function () {
                alert("请求超时，请稍后再试");
                AppFacade.handleError("timeout");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("没有您想找的测试报告，现在带您进入实验室");
                AppFacade.handleError("notfound");
            }
        });
    }
});

var Suggestion = Backbone.Model.extend({
    suggestion_id : 0,
    suggestion_text : ""
});

var SuggestionsCollection = Backbone.Collection.extend({
    model: Suggestion,
    url: "js/backbone/data/suggestions.json?u"
});

var Product = Backbone.Model.extend ( {
    product_id:0,
    product_name : "",
    is_deep_care : false
});

var ProductsCollection = Backbone.Collection.extend({
    model: Product,
    url: "js/backbone/data/products.json?v"
});

    
var GeneralSuggetion = Backbone.Model.extend({
    g_suggestion_id : 0,
    suggestion_title : "",
    suggestion_text : ""
});

var GeneralSuggestionsCollection = Backbone.Collection.extend ({
    model: GeneralSuggetion,
    url: "js/backbone/data/general_suggestions.json?u"
});