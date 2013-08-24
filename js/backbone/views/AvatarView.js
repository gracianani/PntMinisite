var app = app || {};

var AvatarView = Backbone.View.extend({

    //... is a list tag.
    tagName: "div",

    // Cache the template function for a single item.
    template: $('#me-template').html(),

    initialize: function () {
        this.$el = $('#me');
    },

    // Re-render the titles of the todo item.
    render: function () {
        this.$el.html(Mustache.render(this.template, this.model.toJSON()));
        return this;
    }

});