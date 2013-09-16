
var app = app || {};

var Report = Backbone.Model.extend({
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
    level:"medium",
    clearSuggestions: function () {
        this.LifeStyleSuggestions = [];
        this.HairCareSuggestions = [];
        this.HairSituationSuggestions = []
        this.Score = 0;
        this.ScoreTitle = "";
        this.QuizId = 0;
        this.ScoreSuggestions = [];
        this.HairProblems = [];
        this.ProductSuggestions = [];
        this.ShareText = "";
        this.level="medium";
    },
    loadSuggestions: function (suggestions) {
        this.clearSuggestions();
        var lifestyleIds = suggestions.lifestyle_suggestions.split(",");
        for (var i = 0; i < lifestyleIds.length; i++) {
            var suggestion = app.SuggestionRepo.findWhere({ suggestion_id: parseInt(lifestyleIds[i]) });
            if (typeof suggestion !== 'undefined') {
                this.LifeStyleSuggestions.push(suggestion.toJSON());
            }
        }
        var hairCareIds = suggestions.haircare_suggestions.split(",");
        for (var i = 0; i < hairCareIds.length; i++) {
            var suggestion = app.SuggestionRepo.findWhere({ suggestion_id: parseInt(hairCareIds[i]) });
            if (typeof suggestion !== 'undefined') {
                this.HairCareSuggestions.push(suggestion.toJSON());
            }
        }
        var hairSituationIds = suggestions.hairsituation_suggestions.split(",");
        for (var i = 0; i < hairSituationIds.length; i++) {
            var suggestion = app.SuggestionRepo.findWhere({ suggestion_id: parseInt(hairSituationIds[i]) });
            if (typeof suggestion !== 'undefined') {
                this.HairSituationSuggestions.push(suggestion.toJSON());
            }
        }
        this.Score = suggestions.score;
        var gSuggestion = app.GeneralSuggestionRepo.findWhere({ g_suggestion_id: 1 });

        if (suggestions.score > 50 && suggestions.score < 80) {
            gSuggestion = app.GeneralSuggestionRepo.findWhere({ g_suggestion_id: 2 });
        }
        else if (suggestions.score > 80) {
            gSuggestion = app.GeneralSuggestionRepo.findWhere({ g_suggestion_id: 3 });
        }
        this.ShareText = gSuggestion.get("share_text_begin_with");
        this.level = gSuggestion.get("g_level");
        this.ScoreTitle = gSuggestion.get("suggestion_title");
        this.ScoreSuggestions.push(gSuggestion.get("suggestion_text"));
        this.QuizId = suggestions.quizId;
        var problem = app.Views.HairQualityView.model.getMultipleAnswerText(21);
        if (problem.length > 0) {
            this.HairProblems.push(problem);
        }

        this.HairProblems.push(app.Views.HairStyleView.model.getAnswerText(14));

        var productIds = suggestions.suggested_products.split(",");
        for (var i = 0; i < productIds.length; i++) {
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

    getReport: function () {
        var requestData = '{ user_answers : \"' + JSON.stringify(AppFacade.getUserAnswers()).replace(/"/g, '\'') + '\", quizId : 0, str_user : \"' + JSON.stringify(app.User).replace(/"/g, '\'') + ' \" }';
        var self = this;

        $.ajax({
            type: "POST",
            url: 'WeiboWebServices.asmx/SubmitAnswer',
            timeout: 5000,
            data: requestData,
            datatType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                self.loadSuggestions($.parseJSON(data.d));
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
<<<<<<< HEAD
                alert("很抱歉，生成请求失败了");
                window.location.reload();
=======
            },
            complete: function (e) {
>>>>>>> 2ebeb72c556267d075128c9e3ec7c7313d3d83c3
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
                self.loadSuggestions(response.suggestions);
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
                var response = $.parseJSON(data.d);
                app.ReportId = response.report_id;
                AppFacade.setUserAnswers($.parseJSON(data.d).user_answers);
                AppFacade.saveToCookie();
                self.loadSuggestions(response.suggestions);
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