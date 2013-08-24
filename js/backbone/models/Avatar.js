var app = app || {};

var Avatar = Backbone.Model.extend({

    gender: "",
    age_id: "",
    career_id: "",
    hairColor: "",
    hairStyle: "",
    hairLength : "",
    city: "",

    // Default attributes for the todo item.
    defaults: function () {
        return {
            gender: "female",
            age_id: 3,
            career_id: 1
        };
    },

    initialize: function () {
        this.set({ gender: "female", career_id: 1, hairLength:"short", hairStyle: "bigCurly" });
    },

    getOutfit: function () {
        return Outfit[this.get("gender")][this.getCareer()];
    },

    getCareer: function () {
        var that = this;
        var career = $.grep(Careers, function (e) { return e.career_id == that.get("career_id"); });
        return career[0].career_name;
    }
});

