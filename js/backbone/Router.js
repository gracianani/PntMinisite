
var app = app || {};

var Router = Backbone.Router.extend({
    routes: {
        "Survey/:id": "details",
        "": "index"
    },

    index: function () {
        if (getParameterByName('code') == '') {
            window.AppFacade.init();
            window.AppFacade.setCurrentView(app.Views.HairStyleView);
        }
    },

    details: function (id) {
        AppFacade.init();
        if (id == 2) {
            window.AppFacade.setCurrentView(app.Views.HairStyleView);
        }
        else if (id == 4) {
            window.AppFacade.setCurrentView(app.Views.LifeView);
        }
        else if (id == 6) {
            window.AppFacade.setCurrentView(app.Views.DietView);
        }
        else if (id == 5) {
            window.AppFacade.setCurrentView(app.Views.HealthView);
        }
        else if (id == 7) {
            window.AppFacade.setCurrentView(app.Views.CleaningView);
        }


    }
});
