
var BasicinfoState = new State( {
	"onEnter" : function() {
		var basicinfoView = new BasicinfoView();
		window.AppFacade.setCurrentView(basicinfoView);
	},
	"onExit" : function() {
		
	}
} );

var BasicinfoView = function(){
	this.init();
}
BasicinfoView.prototype = {
	animateIn : function() {
		AnimationHandler.animateIn();
	},
	init : function() {
		var self = this;
		this.el = $('#scene-basicinfo').removeClass('hidden');
		
		$('#character-container').removeClass('hidden mirror-show quality-scene');
		
		AnimationHandler.initialize('#scene-basicinfo-content');
		
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