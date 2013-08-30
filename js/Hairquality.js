
var HairqualityState = new State( {
	"onEnter" : function() {
		var hairqualityView = new HairqualityView();
		window.AppFacade.setCurrentView(hairqualityView);
	},
	"onExit" : function() {
		
	}
} );

var HairqualityView = function(){
	this.init();
}
HairqualityView.prototype = {
	animateIn : function() {
		AnimationHandler.animateIn();
	},
	init : function() {
		var self = this;
		this.el = $('#scene-hairquality').removeClass('hidden');
		
		$('#character-container').removeClass('hidden').addClass('mirror-show quality-scene');;
		
		AnimationHandler.initialize('#scene-hairquality-content');
		
		this.initQuestionHint();
		this.initAnswerTooltip();
		
		
		$('.quality-progree-draggable').draggable({
			axis: "x",
			containment: "parent"
		});
		
		
	},
	initQuestionHint : function() {
		//this.el.find('.drink').hint('#hint-drink');
	},
	initAnswerTooltip : function() {
		//this.el.find('.cleaning-tool,.cleaning-style,.cleaning-care').tooltip();
	}
}