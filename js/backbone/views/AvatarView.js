var app = app || {};

var AvatarView = Backbone.View.extend({

    //... is a list tag.
    tagName: "div",

    // Cache the template function for a single item.
    template: $('#me-template').html(),

    initialize: function () {
        this.$el = $('#main');
    },

    // Re-render the titles of the todo item.
    render: function () {

        this.model.setHairData();
        this.model.setCareer();
        this.model.setGender();

        if (AppFacade.getCurrentView().id == "report") {
        	this.$el =  $("#report-avatar");
            this.$el.html(Mustache.render(this.template, this.model));
            
        }
        else {
        	 this.$el = $('#main');
            this.$el.prepend(Mustache.render(this.template, this.model));
            this.startBlink();
        }
        
           

        return this;
    },
    sad: function () {
        this.$el.find('.face').attr('class', 'face face-' + this.model.gender + '-3');
        this.stopBlink();
    },
    smile: function () {
        this.$el.find('.face').attr('class', 'face');
    },
    blink: function () {
        var self = this;
        this.$el.find('.face').attr('class', 'face face-' + this.model.gender + '-2');
        var timer = setTimeout(function () {
            self.smile();
            clearTimeout(timer);
        }, 500);

    },
    startBlink: function () {
    	if (!this.blinkTimer) {
	        var self = this;
	        this.blinkTimer = setInterval(function () {
	            self.blink();
	        }, 3000);
        }
    },
    stopBlink: function () {
        if (this.blinkTimer) {
            clearInterval(this.blinkTimer);
            this.blinkTimer = null;
        }
    }

});