

var ReportView = Backbone.View.extend({
    //... is a list tag.
    tagName: "div",
    id: "report",
    className: "container",
    // Cache the template function for a single item.
    template: $('#report-template').html(),

    events: {

    },

    initialize: function () {
        this.$el = $('#report');
        this.on("finishloading", this.render);
        this.on("render", this.postRender);
    },

    // Re-render the titles of the todo item.
    render: function () {
        this.$el.html(Mustache.render(this.template, this.model));
        app.Views.AvatarView.render();
        this.trigger("render");
        return this;
    },
    postRender: function () {
        AnimationHandler.animateOut("report", function () {
            $("#main").fadeOut(function () { $('#report').fadeIn(); });
        });
    }
});