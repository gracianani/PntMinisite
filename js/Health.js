
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
		
		
		
		
		this.el.find('.health-degree-content').on('click',function(e) {
			//calculate the degree base on y position
			var degreeContent = $(this);
			
			var degreesCount = parseInt(degreeContent.find('.health-degree-item').size() );
			var degree = Math.ceil((degreeContent.offset().top + degreeContent.height() - e.pageY) / degreeContent.height() * degreesCount ) ;
			
			degree = Math.min(degreesCount,degree);
			degree = Math.max(1,degree);
			
			degreeContent.attr('class','health-degree-content').addClass('onDegree-' + degree);
			
			
			degreeContent.find('.health-degree-hint').html(degreeContent.find('[data-degree="'+degree+'"]').attr('title'));
			
		});
		
		this.el.find('.health-degree-pin').draggable({ 
			axis: "y",
			containment: "parent",
			stop: function() {
				
				//calculate the degree base on y position
				var degreeContent = $(this).parent();
				
				var degreesCount = parseInt(degreeContent.find('.health-degree-item').size() );
				var degree = Math.ceil((degreeContent.offset().top + degreeContent.height() - $(this).offset().top) / degreeContent.height() * degreesCount ) ;
				
				degree = Math.min(degreesCount ,degree);
				degree = Math.max(1,degree);
				
				degreeContent.attr('class','health-degree-content').addClass('onDegree-' + degree);
				degreeContent.find('.health-degree-hint').html(degreeContent.find('[data-degree="'+degree+'"]').attr('title'));
				
				$(this).attr('style','');
				
			
		} });
		
		
	},
	initQuestionHint : function() {
		//this.el.find('.drink').hint('#hint-drink');
		
	},
	initAnswerTooltip : function() {
		this.el.find('.health-degree-item').tooltip();
	}
}