
var HealthState = new State( {
	"onEnter" : function() {
		var healthView = new HealthView();
		window.AppFacade.setCurrentView(healthView);
	},
	"onExit" : function() {
		
	}
} );

var HealthView = function(){
	this.init();
}
HealthView.prototype = {
	animateIn : function() {
		AnimationHandler.animateIn();
	},
	init : function() {
		var self = this;
		
		this.el = $('#scene-health');
		
		AnimationHandler.initialize('#scene-health-content');
		
		this.initQuestionHint();
		this.initAnswerTooltip();
		
		//this.initFruit();
		
		
		
	},
	initQuestionHint : function() {
		//this.el.find('.drink').hint('#hint-drink');
		
	},
	initAnswerTooltip : function() {
		//this.el.find('.drink,.taste,.fruit').tooltip();
	}
}