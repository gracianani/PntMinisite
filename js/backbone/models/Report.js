
var app = app || {};

var Report = Backbone.Model.extend({
    LifeStyleSuggestions: [],
    HairCareSuggestions: [],
    HairSituationSuggestions: [],
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
        app.Views.ReportView.trigger("finishloading");
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