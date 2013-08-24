
var app = app || {};

var Router = Backbone.Router.extend({
    routes: {
        "Survey/:id": "details",
        "": "index"
    },

    index: function () {
        window.AppFacade.init();
    },

    details: function (id) {
        var basicFrame = new BasicFrameView();

        if (id == 6) {
            window.AppFacade.setCurrentView(app.Views.DietView);
        }
        else if (id == 5) {
            window.AppFacade.setCurrentView(app.Views.HealthView);
        }



    }
});
