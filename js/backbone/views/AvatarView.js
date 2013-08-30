var app = app || {};

var AvatarView = Backbone.View.extend({

    //... is a list tag.
    tagName: "div",

    // Cache the template function for a single item.
    template: $('#me-template').html(),

    initialize: function () {
        this.$el = $('#main');
    },

    // Re-render the titles of the todo item.
    render: function () {
        var hairData = app.Views.AvatarView.model.getHairData();
        this.model.hairCurly = hairData.curl;
        this.model.hairLength = hairData.length;
        this.hairColor = hairData.color;

        this.$el.prepend(Mustache.render(this.template, this.model));
        return this;
    }

});