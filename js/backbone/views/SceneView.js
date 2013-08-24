var app = app || {};

var MainView = Backbone.View.extend({
    events: {
        "click #next": "processToNextQuestion"
    },
    initialize: function () {
        this.$el = $('body');
    },
    processToNextQuestion: function () {
        AppFacade.getCurrentView().leave();
    }
});

var HealthView = Backbone.View.extend({
    tagName: "div",
    id: 'scene-health',
    className: "scene",
    template: $('#scene-health-template').html(),

    events: {
        "click .health-degree-content": "answerHealthQuestions"
    },

    answerHealthQuestions: function (event) {
        //calculate the degree base on y position
        var item = event.currentTarget;
        var degreeContent = $(item);

        var degreesCount = parseInt(degreeContent.find('.health-degree-item').size());
        var degree = Math.ceil((degreeContent.offset().top + degreeContent.height() - event.pageY) / degreeContent.height() * degreesCount);

        degree = Math.min(degreesCount, degree);
        degree = Math.max(1, degree);

        degreeContent.attr('class', 'health-degree-content').addClass('onDegree-' + degree);
        degreeContent.find('.health-degree-hint').html(degreeContent.find('[data-degree="' + degree + '"]').attr('title'));

        this.model.setAnswerByDegree(parseInt($(item).attr("data-question-id")), degree, true);
    },

    initHealthQuestions: function () {
        var that = this;
        this.$el.find('.health-degree-pin').draggable({
            axis: "y",
            containment: "parent",
            stop: function () {

                //calculate the degree base on y position
                var degreeContent = $(this).parent();

                var degreesCount = parseInt(degreeContent.find('.health-degree-item').size());
                var degree = Math.ceil((degreeContent.offset().top + degreeContent.height() - $(this).offset().top) / degreeContent.height() * degreesCount);

                degree = Math.min(degreesCount, degree);
                degree = Math.max(1, degree);

                degreeContent.attr('class', 'health-degree-content').addClass('onDegree-' + degree);
                degreeContent.find('.health-degree-hint').html(degreeContent.find('[data-degree="' + degree + '"]').attr('title'));

                that.model.setAnswerByDegree(parseInt($(degreeContent).attr("data-question-id")), degree, true);
                $(this).attr('style', '');
            }
        });
    },

    initAnswerTooltip: function () {
        this.$el.find('.health-degree-item').tooltip();
    },

    animateIn: function () {
        AnimationHandler.animateIn();
    },

    initialize: function () {
        this.$el = $('#main');
        this.on("render", this.postrender);
        this.on("beginRender", this.render);
    },
    // Re-render the titles of the todo item.
    render: function () {
        this.$el.html(Mustache.render(this.template, this.model.toJSON()));
        this.initAnswerTooltip();
        this.initHealthQuestions();
        this.trigger("render");
        return this;
    },

    postrender: function () {
        AnimationHandler.initialize('#scene-health-content');
        this.animateIn();
    },

    leave: function () {
        var nextView = app.Views.DietView;
        AppFacade.setCurrentView(nextView);
        AnimationHandler.animateOut("next", function () { AppFacade.getCurrentView().render(); });
    }
});

var DietView = Backbone.View.extend({

    //... is a list tag.
    tagName: "div",
    id: "scene-diet",
    className: "scene",
    // Cache the template function for a single item.
    template: $('#scene-diet-template').html(),

    events: {
        "click .taste": "answerTasteQuestion",
        "click .drink": "answerDrinkQuestion",
        "click #fruit": "answerFruitQuestion"
    },

    animateIn: function () {
        AnimationHandler.animateIn();
    },

    answerTasteQuestion: function (event) {
        var item = event.currentTarget;
        $(item).toggleClass('selected');
        var isSelected = $(item).attr('data-selected');

        this.model.setAnswer(parseInt($(item).parent().attr("data-question-id")), parseInt($(item).attr("data-answer-id")), isSelected);

        if (isSelected) {
            $(item).attr('data-selected', 0);
        } else {
            $(item).attr('data-selected', 1);
        }

    },

    answerFruitQuestion: function (event) {
        var item = event.currentTarget;
        var width = $(item).width();
        var degree = Math.max(Math.min(Math.floor((e.pageX - $(this).offset().left) / width * 4), 3), 0);
        $(item).attr('data-degree', degree);
        $(item).removeClass('fruit-degree-0').removeClass('fruit-degree-1').removeClass('fruit-degree-2').removeClass('fruit-degree-3').addClass('fruit-degree-' + degree).addClass('selected');
        this.model.setAnswerByAnswerIndex(parseInt($(item).attr("data-question-id")), degree, true);
    },

    answerDrinkQuestion: function (event) {
        var item = event.currentTarget;
        $(item).toggleClass('selected');
        var isSelected = $(item).attr('data-selected');
        this.model.setAnswer(parseInt($(item).parent().attr("data-question-id")),parseInt($(item).attr("data-answer-id")), isSelected);
        if (isSelected) {
            $(item).attr('data-selected', 0);
        } else {
            $(item).attr('data-selected', 1);
        }
    },

    initQuestionHint: function () {
        this.$el.find('.drink').hint('#hint-drink');
        this.$el.find('.taste').hint('#hint-taste');
        this.$el.find('.fruit').hint('#hint-fruit');
    },
    initAnswerTooltip: function () {
        this.$el.find('.drink,.taste,.fruit').tooltip();
    },
    initFruit: function () {
        var self = this;
        this.$el.find('#fruit').on('mousemove', function (e) {
            //set background postion base on degree
            var width = $(this).width();
            var degree = Math.max(Math.min(Math.floor((e.pageX - $(this).offset().left) / width * 4), 3), 0);

            $(this).removeClass('fruit-degree-0').removeClass('fruit-degree-1').removeClass('fruit-degree-2').removeClass('fruit-degree-3').addClass('fruit-degree-' + degree);

            //update tooltip
            var title = app.QuestionRepo.findWhere({ name: "fruit" }).get("answers")[degree].text;
            $('#tooltip .content').html(title);

        }).on('mouseleave', function (e) {
            //set background postion base on degree data
            var degree = $(this).attr('data-degree');
            $(this).removeClass('fruit-degree-0').removeClass('fruit-degree-1').removeClass('fruit-degree-2').removeClass('fruit-degree-3').addClass('fruit-degree-' + degree);

        })
    },

    initialize: function () {
        this.$el = $('#main');
        this.on("render", this.postrender);
        this.on("beginRender", this.render);
    },


    // Re-render the titles of the todo item.
    render: function () {
        this.$el.html(Mustache.render(this.template, this.model.toJSON()));

        this.initQuestionHint();
        this.initAnswerTooltip();
        this.initFruit();

        this.trigger("render");
        return this;
    },

    postrender: function () {
        AnimationHandler.initialize('#scene-diet-content');
        this.animateIn();
    },

    leave: function () {
        var nextView = app.Views.HealthView;
        AppFacade.setCurrentView(nextView);
        AnimationHandler.animateOut("next", function () { AppFacade.getCurrentView().render(); });
    }

});