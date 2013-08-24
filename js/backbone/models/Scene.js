
var app = app || {};

var Scene = Backbone.Model.extend({

    // Default attributes for the todo item.
    defaults: function () {
    },

    initialize: function () {
        var question_ids = this.get("question_ids");
        var user_answers = [];
        for (var index in question_ids) {
            user_answers.push({ "question_id": question_ids[index], "answer_ids": [] });
        }
        this.set({ user_answers: user_answers });
    },

    getUserAnswerByQuestionId: function (question_id) {
        var question = $.grep(this.get("user_answers"), function (e) { return e.question_id == question_id });
        return question[0];
    },

    setAnswer: function (question_id, answer_id, isSelected) {
        var answers = this.get("user_answers");
        var user_question = this.getUserAnswerByQuestionId(question_id);
        var question = app.QuestionRepo.findWhere({ question_id: question_id }).toJSON();
        if (user_question != null) {
            if (question.question_type == "single") {
                user_question.answer_ids = [];
                user_question.answer_ids.push(answer_id);
            }
            else if (question.question_type == "multiple") {
                if (user_question.answer_ids.indexOf(answer_id) > -1 && !isSelected) {
                    user_question.answer_ids.splice(user_question.answer_ids.indexOf(answer_id), 1);
                }
                else if (user_question.answer_ids.indexOf(answer_id) == -1 && isSelected) {
                    user_question.answer_ids.push(answer_id);
                }
            }
        }
    },

    setAnswerByAnswerIndex: function (question_id, answer_index, isSelected) {
        var question = app.QuestionRepo.findWhere({ question_id: question_id }).toJSON();
        var answer_id = question.answers[answer_index];
        this.setAnswer(question_id, answer_id, isSelected);
    },

    setAnswerByDegree: function (question_id, answer_degree, isSelected) {
        var question = app.QuestionRepo.findWhere({ question_id: question_id });
        var answer_id = $.grep(question.get("answers"), function (e) { return e.degree == answer_degree })[0].answer_id;
        this.setAnswer(question_id, answer_id, isSelected);
    },

    isQuestionFinished: function (question_id) {
        var question = app.QuestionRepo.findWhere({ question_id: question_id }).toJSON();
        var userAnswer = this.getUserAnswerByQuestionId(question_id);
        if (question != null && userAnswer != null) {
            if (question.question_type == "single" && userAnswer.answer_ids.length == 1) {
                return true;
            }
            else if (question.question_type == "multiple" && userAnswer.answer_ids.length >= 1) {
                return true;
            }
        }
        return false;
    },

    isSceneFinished: function () {
        var scene_questions = this.get("question_ids");
        for (var question_id in scene_questions) {
            if (this.isQuestionFinished(scene_questions[question_id])) {
                console.log(scene_questions[question_id] + "finished");
            }
            else {
                console.log(scene_questions[question_id] + "unfinished");
            }
        }
    }
});

var Question = Backbone.Model.extend({
    question_id :0,
    text : "",
    name : "",
    question_type: "single",
    answers: []
});

var SceneSetting = Backbone.Model.extend({
    scene_id: 0,
    scene_name: "",
    scene_title: "",
    next_scene_id: 1,
    question_ids: []
});

var QuestionsCollection = Backbone.Collection.extend({
    model: Question,
    url: "js/backbone/data/questions.json?u"
});


var SceneSettingsCollection = Backbone.Collection.extend({
    model: SceneSetting,
    url: "js/backbone/data/scene_settings.json?u"
});