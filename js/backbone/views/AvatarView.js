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

        this.$el.prepend(Mustache.render(this.template, this.model));
        
        if ( !this.blinkTimer ) {
	        this.startBlink();
        }
        
        return this;
    },
    sad: function() {
	    this.$el.find('.face').attr('class','face face-' +  this.model.gender + '-3');
    },
    smile: function() {
	    this.$el.find('.face').attr('class','face');
    },
    blink: function() {
    	var self = this;
    	this.$el.find('.face').attr('class','face face-' +  this.model.gender + '-2');
    	var timer = setTimeout(function() {
    		self.smile();
    		clearTimeout(timer);
    	}, 500);
    	
    },
    startBlink: function() {
	    var self = this;
	    this.blinkTimer = setInterval(function(){
		    self.blink();
	    }, 3000);
    },
    stopBlink: function() {
    	if ( this.blinkTimer ) {
	    	clearInterval(this.blinkTimer);
    	}
    }

});