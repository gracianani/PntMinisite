var app = app || {};

var Avatar = Backbone.Model.extend({
    // Default attributes for the todo item.
    defaults: {
        gender: "fm",
        age_id: 3,
        career_id: 0,
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
    },
    getAvatarScene: function () {
        return function () {
            if (AppFacade.getCurrentView().model.get("scene_id") == 1) {
                return "basicinfo-scene";
            }
            else if (AppFacade.getCurrentView().model.get("scene_id") == 3) {
                return "mirror-show quality-scene";
            }
            else if (AppFacade.getCurrentView().model.get("scene_id") == 6) {
                return "diet-scene";
            }
            else {
                return "mirror-show";
            }
        }
    },
    getAvatarSize : function() {
	    return function() {
		    if (AppFacade.getCurrentView().model.get("scene_id") == 1) {
                return "large";
            }
            else if (AppFacade.getCurrentView().model.get("scene_id") == 3) {
                return "large";
            }
            else {
                return "large";
            }
	    }
    },
    getHairData: function () {
        var hairData = {
            length: app.Views.HairStyleView.model.getAnswerName(13),
            curl: app.Views.HairStyleView.model.getAnswerDegree(14),
            color: app.Views.HairStyleView.model.getAnswerName(15)
        };
        if (typeof hairData.length === 'undefined' || hairData.length == '') {
            hairData.length = 'l';
        }
        if (hairData.curl == 0) {
            hairData.curl = 2;
        }
        if (hairData.color == '') {
            hairData.color = 'red';
        }
        return hairData;
    },
    getCareer: function() {
    	var user_career = app.Views.BasicInfoView.model.getAnswerName(24);
    	if( !user_career ) {
	    	user_career = "0";
    	}
    	console.log(user_career);
    	return parseInt(user_career);
    }
});

