requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/vendor'
});

var app = {
    Models: {},
    Views: {},
    User: {},
    weiboApp: {
        authorize_uri: 'https://api.weibo.com/oauth2/authorize',
        app_id: '695724734',
        app_secret: '826f57c0da924e1a2cc7b90c7c26b56a',
        redirect_uri: 'http://localhost:59884/PntMinisite/index.html'
    }
};

window.AppFacade = {
    init: function () {
        if (typeof app.Views.LoadingView == 'undefined') {
            this.initLoading();
        }
        else if (typeof app.Views.BasicFrameView == 'undefined') {
            this.initBasicFrame();
        }
    },
    initLoading: function () {
        app.Views.LoadingView = new LoadingView();
    },
    initBasicFrame: function () {
        app.Views.BasicFrameView = new BasicFrameView();
    },
    setCurrentView: function (view) {
        this.currentView = view;
    },
    getCurrentView: function () {
        return this.currentView;
    },
    getUserAnswers: function () {
        var user_answers = [];

        user_answers.push({ scene_id: '2', user_answers: app.Views.HairStyleView.model.get("user_answers") });
        user_answers.push({ scene_id: '4', user_answers: app.Views.LifeView.model.get("user_answers") });
        user_answers.push({ scene_id: '5', user_answers: app.Views.HealthView.model.get("user_answers") });
        user_answers.push({ scene_id: '6', user_answers: app.Views.DietView.model.get("user_answers") });
        user_answers.push({ scene_id: '7', user_answers: app.Views.CleaningView.model.get("user_answers") });

        return user_answers;
    },
    setUserAnswers: function (user_answers) {
        for (var i = 0; i < user_answers.length; i++) {
            var user_answer = user_answers[i];
            if (user_answer.scene_id == 2) {
                app.Views.HairStyleView.model.set("user_answers", user_answer.user_answers);
            }
            else if (user_answer.scene_id == 4) {
                app.Views.LifeView.model.set("user_answers", user_answer.user_answers);
            }
            else if (user_answer.scene_id == 5) {
                app.Views.HealthView.model.set("user_answers", user_answer.user_answers);
            }
            else if (user_answer.scene_id == 6) {
                app.Views.DietView.model.set("user_answers", user_answer.user_answers);
            }
            else if (user_answer.scene_id == 7) {
                app.Views.CleaningView.model.set("user_answers", user_answer.user_answers);
            }
        }
    },
    saveToCookie: function () {
        var user_answers = this.getUserAnswers();
        var str_user_answers = JSON.stringify(user_answers);
        createCookie("user_answers", str_user_answers, 14);
        var current_scene_id = AppFacade.getCurrentView().model.get("scene_id");
        createCookie("current_scene_id", current_scene_id, 14);
        var user_info = app.User;
        var str_user_info = JSON.stringify(user_info);
        createCookie("current_user_info", str_user_info, 14);
    },
    loadFromCookie: function (isTrigger) {
        var str_user_answers = readCookie("user_answers");
        this.setUserAnswers($.parseJSON(str_user_answers));
        var current_scene_id = readCookie("current_scene_id");
        var str_user_info = readCookie("user_info");
        var user_info = $.parseJSON(str_user_info);
        app.User = user_info;
        app.Router.navigate("Survey/" + current_scene_id, { trigger: isTrigger });
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
                // initialize scenes and avatar

                app.Views.MainView = new MainView();
                var avatar = new Avatar;
                app.Views.AvatarView = new AvatarView({ model: avatar });
                var hairStyleScene = new Scene(app.SceneSettings.findWhere({ scene_id: 2 }).toJSON());
                var hairStyleView = new  HairStyleView({ model: hairStyleScene });
                var lifeScene = new Scene(app.SceneSettings.findWhere({ scene_id: 4 }).toJSON());
                var lifeView = new LifeView({ model: lifeScene });
                var dietScene = new Scene(app.SceneSettings.findWhere({ scene_id: 6 }).toJSON());
                var dietView = new DietView({ model: dietScene });
                var healthScene = new Scene(app.SceneSettings.findWhere({ scene_id: 5 }).toJSON());
                var healthView = new HealthView({ model: healthScene });
                var cleaningScene = new Scene(app.SceneSettings.findWhere({ scene_id: 7 }).toJSON());
                var cleaningView = new CleaningView({ model: cleaningScene });

                app.Views.HairStyleView = hairStyleView;
                app.Views.DietView = dietView;
                app.Views.HealthView = healthView;
                app.Views.CleaningView = cleaningView;
                app.Views.LifeView = lifeView;

                app.Router = new Router();
                Backbone.history.start();

                var code = getParameterByName("code");
                var isCallback = code == '';
                // handle callback from weibo
                if (code != '' && typeof app.User.access_token == 'undefined') {
                    var requestData = '{'
                                + 'client_id : ' + '\"' + app.weiboApp.app_id + '\",'
                                + 'client_secret : ' + '\"' + app.weiboApp.app_secret + '\",'
                                + 'grant_type : ' + '\"authorization_code\", '
                                + 'code : ' + '\"' + app.User.code + '\", '
                                + 'redirect_uri : ' + '\"' + app.weiboApp.redirect_uri + '\"'
                                + '}';
                    $.ajax({
                        type: "POST",
                        url: 'WeiboWebServices.asmx/GetUserInfo',
                        timeout: 5000,
                        data: requestData,
                        datatType: "json",
                        contentType: "application/json;charset=utf-8",
                        success: function (data) {
                            var json = $.parseJSON(data.d);
                            app.User.access_token = json.access_token;
                            app.User.uid = json.uid;
                            app.User.code = code;
                            $("#weibo").addClass("authenticated");
                        }
                    });
                    AppFacade.loadFromCookie(isCallback);
                }


            }
        );

    }
);





    



