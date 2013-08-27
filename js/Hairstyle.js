
var HairstyleState = new State( {
	"onEnter" : function() {
		var hairstyleView = new HairstyleView();
		window.AppFacade.setCurrentView(hairstyleView);
	},
	"onExit" : function() {
		
	}
} );

var HairstyleView = function(){
	this.init();
}
HairstyleView.prototype = {
	animateIn : function() {
		AnimationHandler.animateIn();
	},
	init : function() {
		var self = this;
		this.el = $('#scene-hairstyle').removeClass('hidden');
		
		AnimationHandler.initialize('#scene-hairstyle-content');
		
		this.initQuestionHint();
		this.initAnswerTooltip();
		
		
		
		
		
		
		
	},
	initQuestionHint : function() {
		//this.el.find('.drink').hint('#hint-drink');
	},
	initAnswerTooltip : function() {
		//this.el.find('.cleaning-tool,.cleaning-style,.cleaning-care').tooltip();
	}
}