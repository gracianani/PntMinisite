
var DietState = new State( {
	"onEnter" : function() {
		var dietView = new DietView();
		window.AppFacade.setCurrentView(dietView);
	},
	"onExit" : function() {
		
	}
} );

var DietView = function(){
	this.init();
}
DietView.prototype = {
	animateIn : function() {
		AnimationHandler.animateIn();
	},
	init : function() {
		var self = this;
		this.sceneData = scenes["diet"];
		this.questionsData = this.sceneData.questions;
		this.el = $('#scene-diet');
		
		AnimationHandler.initialize('#scene-diet-content');
		
		this.initQuestionHint();
		this.initAnswerTooltip();
		
		this.initFruit();
		
		
		this.el.find('.drink,.taste').on('click',function(){
			
			$(this).toggleClass('selected');
			var isSelected = $(this).attr('data-selected');
			if ( isSelected ) {
				$(this).attr('data-selected',0);
			} else {
				$(this).attr('data-selected',1);
			}
		});
		
	},
	initQuestionHint : function() {
		this.el.find('.drink').hint('#hint-drink');
		this.el.find('.taste').hint('#hint-taste');
		this.el.find('.fruit').hint('#hint-fruit');
	},
	initAnswerTooltip : function() {
		this.el.find('.drink,.taste,.fruit').tooltip();
	},
	initFruit : function() {
		var self = this;
		this.el.find('#fruit').on('mousemove',function(e) {
			//set background postion base on degree
			var width = $(this).width();
			var degree = Math.floor((e.pageX - $(this).offset().left) / width * 4);
			$(this).removeClass('fruit-degree-0').removeClass('fruit-degree-1').removeClass('fruit-degree-2').removeClass('fruit-degree-3').addClass('fruit-degree-' + degree);
			
			//update tooltip
			var title = self.questionsData['fruit'].answers[degree].title;
			$('#tooltip .content').html(title);
			
		}).on('mouseleave',function(e) {
			//set background postion base on degree data
			var degree = $(this).attr('data-degree');
			$(this).removeClass('fruit-degree-0').removeClass('fruit-degree-1').removeClass('fruit-degree-2').removeClass('fruit-degree-3').addClass('fruit-degree-' + degree);

		}).on('click',function(e) {
			//set degree data
			var width = $(this).width();
			var degree = Math.floor((e.pageX - $(this).offset().left) / width * 4);
			$(this).attr('data-degree',degree);
			
			//set class
			$(this).removeClass('fruit-degree-0').removeClass('fruit-degree-1').removeClass('fruit-degree-2').removeClass('fruit-degree-3').addClass('fruit-degree-' + degree).addClass('selected');
			

		});
	}
}