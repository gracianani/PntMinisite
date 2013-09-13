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

requirejs(['backbone/models/Avatar', 'backbone/models/Report', 'backbone/utils/plugins'],
    function (avatar, report) {
        app.SuggestionRepo = new SuggestionsCollection;
        app.SuggestionRepo.fetch();
        app.ProductRepo = new ProductsCollection;
        app.ProductRepo.fetch();
        app.GeneralSuggestionRepo = new GeneralSuggestionsCollection;
        app.GeneralSuggestionRepo.fetch();
        app.PlainReport = new PlainReport;
        var reportId = getParameterByName("reportId");
        if (reportId != "") {
            app.PlainReport.saveReportImage(reportId);
        }
    }
 )

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
    fillSuggestions: function (suggestions) {

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
        this.ScoreTitle = gSuggestion.get("suggestion_title");
        this.ScoreSuggestions.push(gSuggestion.get("suggestion_text"));
        this.QuizId = suggestions.quizId;
     //   this.HairProblems.push(app.Views.HairQualityView.model.getAnswerText(21));
     //   this.HairProblems.push(app.Views.HairStyleView.model.getAnswerText(14));

        var productIds = suggestions.suggested_products.split(",");
        for (var i = 0; i < productIds.length; i++) {
            var suggestion = app.ProductRepo.findWhere({
                product_id: parseInt(productIds[i])
            });
            if (typeof suggestion !== 'undefined') {
                this.ProductSuggestions.push(suggestion.toJSON());
            }
        }
    },
    fillAvatar : function(options)
    {
        this.gender = options.gender;
        this.hairLength = options.hairLength;
        this.career_id = options.career_id;
        this.hairCurly = options.hairCurly;
        this.hairColor = options.hairColor;
        this.hairType = options.hairType;
        console.log(options)
    },
    saveReportImage: function (reportId) {
        var self = this;
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
                window.external.callMe();
            }
        });
    }
});