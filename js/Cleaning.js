
var CleaningState = new State( {
	"onEnter" : function() {
		var cleaningView = new CleaningView();
		window.AppFacade.setCurrentView(cleaningView);
	},
	"onExit" : function() {
		
	}
} );

var CleaningView = function(){
	this.init();
}
CleaningView.prototype = {
	animateIn : function() {
		AnimationHandler.animateIn();
	},
	init : function() {
		var self = this;
		this.el = $('#scene-cleaning').removeClass('hidden');
		
		AnimationHandler.initialize('#scene-cleaning-content');
		
		this.initQuestionHint();
		this.initAnswerTooltip();
		
		
		var trashDegree = [
		"上一次更换品牌",
		"从不更换品牌",
		"一年前换品牌",
		"半年前换品牌",
		"三个月前换品牌"
		]
		
		$('#cleaning-trash-add,#cleaning-trash-content').click(function(){
			var trash = $('#cleaning-trash-content');
			var degree = trash.data('degree');
			if ( degree ) {
				if ( degree == 4 ) {
					degree = 1;
				} else {
					degree = parseInt(degree) + 1;
				}
				
			} else {
				degree = 2;
				trash.removeClass('trash-unselected');
			}
			trash.attr('class','trash-' + degree);
			$('#cleaning-trash-text').html(trashDegree[degree]);
			trash.data('degree',''+degree);
		});	
		$('#cleaning-trash-remove').click(function(){
			var trash = $('#cleaning-trash-content');
			var degree = trash.data('degree');
			if ( degree ) {
				if ( degree == 1 ) {
					degree = 4;
				} else {
					degree = parseInt(degree) - 1;
				}
			} else {
				degree = 4;
				trash.removeClass('trash-unselected');
			}
			trash.attr('class','trash-' + degree);
			$('#cleaning-trash-text').html(trashDegree[degree]);
			trash.data('degree',''+degree);
		});	
		
		
	},
	initQuestionHint : function() {
		//this.el.find('.drink').hint('#hint-drink');
	},
	initAnswerTooltip : function() {
		this.el.find('.cleaning-tool,.cleaning-style,.cleaning-care').tooltip();
	}
}