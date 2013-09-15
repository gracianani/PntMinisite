
var app = app || {};

var Router = Backbone.Router.extend({
    routes: {
        "Survey/:id": "details",
        "": "index",
        "Report/:quizId": "report"
    },

    index: function () {
        window.AppFacade.setCurrentView(app.Views.BasicInfoView);
    },

    report: function (quizId) {
        quizId = quizId.replace(/\D/g, '')
        app.ReportId = quizId;
        app.Report.getReportByReportId(quizId);
        window.AppFacade.setCurrentView(app.Views.ReportView);

    },

    details: function (id) {
        if (id == 1) {
            window.AppFacade.setCurrentView(app.Views.BasicInfoView);
        }
        else if (id == 2) {
            window.AppFacade.setCurrentView(app.Views.HairStyleView);
        }
        else if (id == 3) {
            window.AppFacade.setCurrentView(app.Views.HairQualityView);
        }
        else if (id == 4) {
            window.AppFacade.setCurrentView(app.Views.LifeView);
        }
        else if (id == 5) {
            window.AppFacade.setCurrentView(app.Views.HealthView);
        }
        else if (id == 6) {
            window.AppFacade.setCurrentView(app.Views.DietView);
        }
        else if (id == 7) {
            window.AppFacade.setCurrentView(app.Views.CleaningView);
        }
        else if (id == 8) {
            window.AppFacade.setCurrentView(app.Views.SalonView);
        }

    }
});
