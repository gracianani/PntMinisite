requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/vendor'
});

var app = {
    Models: {},
    Views: {}
};

window.AppFacade = {
    init: function () {

        //SM.RegisterState("diet", DietState);
        this.initLoading();

    },
    initLoading: function () {
        this.loadingView = new LoadingView();
    },
    initBasicFrame: function () {
        this.basicFrame = new BasicFrameView();
    },
    setCurrentView: function (view) {
        this.currentView = view;
    },
    getCurrentView: function () {
        return this.currentView;
    }
}

// Start the main app logic.
requirejs(['../backbone/models/Avatar', '../backbone/models/Scene', '../backbone/utils/Utils', '../backbone/views/AvatarView', , '../backbone/views/SceneView', '../backbone/Router'],
    function (avatar, scene, utils, avatarView, sceneView, router) {
        var questions = new QuestionsCollection;
        questions.fetch();
        app.QuestionRepo = questions;
        app.SceneSettings = new SceneSettingsCollection;



        app.SceneSettings.fetch().done(
            function () {
                var avatar = new Avatar;
                app.Views.MainView = new MainView();
                app.Views.AvatarView = new AvatarView({ model: avatar });
                var dietScene = new Scene(app.SceneSettings.findWhere({ scene_id: 6 }).toJSON());
                var dietView = new DietView({ model: dietScene });
                var healthScene = new Scene(app.SceneSettings.findWhere({ scene_id: 5 }).toJSON());
                var healthView = new HealthView({ model: healthScene });
                app.Views.DietView = dietView;
                app.Views.HealthView = healthView;

                app.Router = new Router();
                Backbone.history.start();
            }
        );

    }
);





    



