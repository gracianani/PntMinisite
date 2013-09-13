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
        app_id: '3695496477',
        app_secret: '942214d88b57723ad419854c67d3c49c',
        redirect_uri: 'http://pantene.app.social-touch.com/'
    },
    qqApp: {
    	authorize_uri: 'https://api.weibo.com/oauth2/authorize',
	    app_id:'100516646',
	    app_key:'6b346735b25a53425c4eda8e41553e96',
	    redirect_uri: 'http://pantene.app.social-touch.com/qc_callback.html'
    }
};

window.AppFacade = {
    init: function () {
        if (typeof app.Views.BasicFrameView == 'undefined') {
            this.initLoading();

        }
    },
    setStartView: function () {
        var isStartFromSplash = false;
        if (this.currentView == undefined) {
            isStartFromSplash = true;


        } else if (!app.Views.BasicInfoView.model.isAnswered(22) && typeof (app.ReportId) == 'undefined') {
            isStartFromSplash = true;
        }
        if (isStartFromSplash) {
            this.initSplash();
        } else {
            this.initBasicFrame();
        }
    },
    initLoading: function () {
        app.Views.LoadingView = new LoadingView();
    },
    initSplash: function () {
        app.Views.SplashView = new SplashView();
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
        user_answers.push({ scene_id: '1', user_answers: app.Views.BasicInfoView.model.get("user_answers") });
        user_answers.push({ scene_id: '2', user_answers: app.Views.HairStyleView.model.get("user_answers") });
        user_answers.push({ scene_id: '3', user_answers: app.Views.HairQualityView.model.get("user_answers") });
        user_answers.push({ scene_id: '4', user_answers: app.Views.LifeView.model.get("user_answers") });
        user_answers.push({ scene_id: '5', user_answers: app.Views.HealthView.model.get("user_answers") });
        user_answers.push({ scene_id: '6', user_answers: app.Views.DietView.model.get("user_answers") });
        user_answers.push({ scene_id: '7', user_answers: app.Views.CleaningView.model.get("user_answers") });
        user_answers.push({ scene_id: '8', user_answers: app.Views.SalonView.model.get("user_answers") });
        return user_answers;
    },
    setUserAnswers: function (user_answers) {
        console.log(user_answers);
        for (var i = 0; i < user_answers.length; i++) {
            var user_answer = user_answers[i];
            if (user_answer.scene_id == 1) {
                app.Views.BasicInfoView.model.set("user_answers", user_answer.user_answers);
            }
            else if (user_answer.scene_id == 2) {
                app.Views.HairStyleView.model.set("user_answers", user_answer.user_answers);
            }
            else if (user_answer.scene_id == 3) {
                app.Views.HairQualityView.model.set("user_answers", user_answer.user_answers);
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
            else if (user_answer.scene_id == 8) {
                app.Views.SalonView.model.set("user_answers", user_answer.user_answers);
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

        if (str_user_answers) {
            this.setUserAnswers($.parseJSON(str_user_answers));
            var current_scene_id = readCookie("current_scene_id");
            var str_user_info = readCookie("user_info");
            var user_info = $.parseJSON(str_user_info);
            if (user_info) {
                app.User = user_info;
            }

            app.Router.navigate("Survey/" + current_scene_id, { trigger: isTrigger });
        } else {
            app.Router.navigate("", true);
        }

    },
    initQQLogin: function () {
        QC.Login({//按默认样式插入QQ登录按钮
            btnId: "qqlogin",
            size: "A_XL"
        },
					window.AppFacade.onQQLoginSuccess, window.AppFacade.onQQLogoutSuccess);
        QC.Login({//按默认样式插入QQ登录按钮
            btnId: "splash-qq",
            size: "A_L"
        },
					window.AppFacade.onQQLoginSuccess, window.AppFacade.onQQLogoutSuccess);
    },
    onQQLoginSuccess: function (reqData, opts) {
        _logoutTemplate = [
				            '<span class="profile-avatar"><img src="{figureurl}" class="{size_key}"/></span>',
				            '<span class="profile-nickname">{nickname}</span>',
				            '<span class="profile-logout"><a href="javascript:QC.Login.signOut();">退出</a></span>'
		].join("");
        $('#prifile-login').html(
				       QC.String.format(_logoutTemplate, {
				           nickname: QC.String.escHTML(reqData.nickname), //做xss过滤
				           figureurl: reqData.figureurl
				       })
		);
        $("#login").addClass("hidden");
        $("#splash-login").hide();

        var self = this;
        console.log(this);
        QC.Login.getMe(function (openId, accessToken) {
            app.User.qq_uid = openId;
            app.User.qq_token = accessToken;
        });
        AppFacade.askForReport();
    },
    onQQLogoutSuccess: function (opts) {//注销成功
        alert('QQ登录 注销成功');
        $('#prifile-login').html('');
        $("#splash-login").show();
    },
    initWbLogin: function () {
        WB2.anyWhere(function (W) {
            W.widget.connectButton({
                id: "splash-weibo",
                type: '2,2',
                callback: {
                    login: window.AppFacade.onWbLoginSuccess,
                    logout: window.AppFacade.onWbLooutSuccess
                }
            });
        });


        WB2.anyWhere(function (W) {
            W.widget.connectButton({
                id: "wb_connect_btn",
                type: '1,1',
                callback: {
                    login: window.AppFacade.onWbLoginSuccess,
                    logout: window.AppFacade.onWbLooutSuccess
                }
            });
        });


    },
    weiboLogout: function () {
        WB2.logout(function () {
            window.AppFacade.onWbLogoutSuccess();
            WB2.anyWhere(function (W) {
                W.widget.connectButton({
                    id: "wb_connect_btn",
                    type: '1,1',
                    callback: {
                        login: window.AppFacade.onWbLoginSuccess,
                        logout: window.AppFacade.onWbLooutSuccess
                    }
                });
            });
        });

    },
    onWbLoginSuccess: function (o) {

        _logoutTemplate = [
				            '<span class="profile-avatar"><img src="{{figureurl}}" class="{size_key}"/></span>',
				            '<span class="profile-nickname">{{nickname}}</span>',
				            '<span class="profile-logout"><a onclick="window.AppFacade.weiboLogout();">退出</a></span>'
		].join("");

        $('#prifile-login').html(Mustache.render(_logoutTemplate, {
            nickname: o.screen_name,
            figureurl: o.profile_image_url
        })
		);


        $("#login").addClass("hidden");
        $("#splash-login").hide();
        $("#login").addClass("hidden");

        app.User.weibo_uid = o.id;

        var tokencookiename = "weibojs_" + app.weiboApp.app_id;
        var tokencookie = readCookie(tokencookiename);

        if (tokencookie) {
            var param = tokencookie.split("%26");
            var token = param[0].split("%3D")[1];
            app.User.weibo_token = token;


        }
        this.askForReport();
    },
    onWbLogoutSuccess: function () {
        alert('微博登陆退 出成功');
        $('#prifile-login').html('');
        $("#splash-login").show();
    },
    isLogin: function () {
        return (app.User.weibo_uid || app.User.qq_uid);
    },
    isQuizFinish: function () {
        var isFinished = true;

        for (var index in app.SceneViews) {
            if (app.SceneViews[index].model) {
                console.log(app.SceneViews[index].model);
                if (app.SceneViews[index].model.isSceneFinished().length > 0) {
                    isFinished = false;
                }
            }
        }
        return isFinished;
    },
    askForReport: function () {
        if (this.isQuizFinish()) {
            app.Report.getReport();
        } else {
            alert("您还有未完成的题目，请仔细检查一下哦！");
        }

    },
    showHelp: function (unfinishedQuestions) {
        alert("您还没有回答完全部问题哦");
    },
    gotoScene: function (step) {

        var currentView = this.getCurrentView();

        var currentStep = parseInt(currentView.model.get("scene_id"));

        if (!currentStep) {
            currentStep = 9;
        }
        console.log(currentStep);
        console.log(step);
        if (step < currentStep) {
            var nextView = app.SceneViews[step - 1];
            this.setCurrentView(nextView);
            app.Router.navigate("Survey/" + nextView.model.get("scene_id"));
            currentView.onexit();
            app.Views.MainView.setProgressBar();
        }
    }
}

// Start the main app logic.
requirejs(['../backbone/models/Avatar', '../backbone/models/Scene', '../backbone/models/Report', '../backbone/utils/Utils', '../backbone/views/AvatarView', '../backbone/views/ReportView', '../backbone/views/SceneView', '../backbone/Router'],
    function (avatar, scene, utils, avatarView, sceneView, router) {
        var questions = new QuestionsCollection;
        questions.fetch();
        app.QuestionRepo = questions;
        app.SuggestionRepo = new SuggestionsCollection;
        app.SuggestionRepo.fetch();
        app.ProductRepo = new ProductsCollection;
        app.ProductRepo.fetch();
        app.GeneralSuggestionRepo = new GeneralSuggestionsCollection;
        app.GeneralSuggestionRepo.fetch();
        app.SceneSettings = new SceneSettingsCollection;
        app.SceneSettings.fetch().done(
            function () {
                // initialize scenes and avatar

                app.Views.MainView = new MainView();
                var avatar = new Avatar;
                app.Views.AvatarView = new AvatarView({ model: avatar });
                var basicInfoScene = new Scene(app.SceneSettings.findWhere({ scene_id: 1 }).toJSON());
                var basicInfoView = new BasicInfoView({ model: basicInfoScene });
                var hairStyleScene = new Scene(app.SceneSettings.findWhere({ scene_id: 2 }).toJSON());
                var hairStyleView = new HairStyleView({ model: hairStyleScene });
                var hairQualityScene = new Scene(app.SceneSettings.findWhere({ scene_id: 3 }).toJSON());
                var hairQualityView = new HairQualityView({ model: hairQualityScene });
                var lifeScene = new Scene(app.SceneSettings.findWhere({ scene_id: 4 }).toJSON());
                var lifeView = new LifeView({ model: lifeScene });
                var dietScene = new Scene(app.SceneSettings.findWhere({ scene_id: 6 }).toJSON());
                var dietView = new DietView({ model: dietScene });
                var healthScene = new Scene(app.SceneSettings.findWhere({ scene_id: 5 }).toJSON());
                var healthView = new HealthView({ model: healthScene });
                var cleaningScene = new Scene(app.SceneSettings.findWhere({ scene_id: 7 }).toJSON());
                var cleaningView = new CleaningView({ model: cleaningScene });
                var salonScene = new Scene(app.SceneSettings.findWhere({ scene_id: 8 }).toJSON());
                var salonView = new SalonView({ model: salonScene });
                var report = new Report;
                var reportView = new ReportView({ model: report });
                app.Report = report;

                app.Views.BasicInfoView = basicInfoView;
                app.Views.HairStyleView = hairStyleView;
                app.Views.HairQualityView = hairQualityView;
                app.Views.DietView = dietView;
                app.Views.HealthView = healthView;
                app.Views.CleaningView = cleaningView;
                app.Views.LifeView = lifeView;
                app.Views.SalonView = salonView;
                app.Views.ReportView = reportView;

                app.SceneViews = [
				    app.Views.BasicInfoView,
				    app.Views.HairStyleView,
				    app.Views.HairQualityView,
				    app.Views.DietView,
				    app.Views.HealthView,
				    app.Views.CleaningView,
				    app.Views.LifeView,
				    app.Views.SalonView
				];

                

                app.Router = new Router();
                Backbone.history.start();
                AppFacade.init();
                AppFacade.initQQLogin();
                AppFacade.initWbLogin();

                var isTrigger = typeof (app.ReportId) == 'undefined';
                if (isTrigger) {
                    AppFacade.loadFromCookie(true);
                }
            }
        );

    }
);





    



