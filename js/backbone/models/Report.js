
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
    loadSuggestions: function (suggestions) {
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
        if (suggestions.score > 50 && suggestions.score > 80) {
            gSuggestion = app.GeneralSuggestionRepo.findWhere({ g_suggestion_id: 2 });
        }
        else if (suggestions.score > 80) {
            gSuggestion = app.GeneralSuggestionRepo.findWhere({ g_suggestion_id: 3 });
        }

        this.ScoreTitle = gSuggestion.get("suggestion_title");
        this.ScoreSuggestions.push(gSuggestion.get("suggestion_text"));
        this.QuizId = suggestions.quizId;
        this.HairProblems.push(app.Views.HairQualityView.model.getAnswerText(21));
        this.HairProblems.push(app.Views.HairStyleView.model.getAnswerText(14));

        AppFacade.setCurrentView(app.Views.ReportView);
        app.Router.navigate("Report/" + this.QuizId);
        app.Views.ReportView.trigger("finishloading");


        console.log(suggestions);
    },

    getReport: function () {
        var requestData = '{ user_answers : ' + '\"' + JSON.stringify(AppFacade.getUserAnswers()).replace(/"/g, '\'') + '\" }';
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
        $.ajax({
            type: "POST",
            url: 'WeiboWebServices.asmx/Share',
            timeout: 5000,
            data: '{ report_id : 8 }',
            datatType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
            }
        });
    },

    getReportByReportId
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