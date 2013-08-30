var app = app || {};

var Avatar = Backbone.Model.extend({
    // Default attributes for the todo item.
    defaults: {
        gender: "fm",
        age_id: 3,
        career_id: 1,
        hairLength: "l",
        hairCurly: 2,
        hairColor: "red"
    },

    initialize: function (option) {
        this.gender = this.defaults.gender;
        this.hairLength = this.defaults.hairLength;
        this.career_id = this.defaults.career_id;
        this.hairCurly = this.hairCurly;
        this.hairColor = this.defaults.hairColor;
    }
});

