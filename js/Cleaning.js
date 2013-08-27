
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
		
		
		$('.cleaning-tool,.cleaning-style,.cleaning-care').click(function(){
			$(this).toggleClass('selected');
		});
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
		

		//shower-frequency
		var showerFrequency = [
		"洗发频率",
		"1周最多1次",
		"4-6天1次",
		"2-3天1次",
		"1天1次",
		"1天2次"
		]
		
		$('#shower-frequency-add').click(function(){
		
			var frequency = $('#shower-frequency').data('#frequency');
			
			if ( frequency ) {
				frequency++;
				if ( frequency > 5) {
					frequency = 1;
				}
			} else {
				frequency = 1;
			}
			
			$('#shower-frequency').data('#frequency',frequency);
			$('#shower-frequency-text').html(showerFrequency[frequency])
			self.showShowerWater(frequency);

		});
		$('#shower-frequency-remove').click(function(){
		
			var frequency = $('#shower-frequency').data('#frequency');
			
			if ( frequency ) {
				frequency--;
				if ( frequency < 1) {
					frequency = 5;
				}
			} else {
				frequency = 5;
			}
			$('#shower-frequency').data('#frequency',frequency);
			$('#shower-frequency-text').html(showerFrequency[frequency])
			self.showShowerWater(frequency);

		});
		
		
		//day and night
		
		$('#shower-time-day').click(function(){
			$(this).css('border','none');
			$(this).toggleClass('unselected');
			
			if ( $('#shower-time-night').hasClass('unselected') ) {
				$('body').css('background-color','transparent');
			} 
			

		});
		$('#shower-time-night').click(function(){
			$(this).css('border','none');
			$(this).toggleClass('unselected');
			if ( $(this).hasClass('unselected')) { 	
	
				$('body').css('background-color','transparent');
				
			} else {
	
				$('body').css('background-color','#1a5b88');
			}
			

		});
		
		
		
		
		
	},
	waterAnimation: function(item) {
		var self = this;
		if ( item.data("show") && item.data("show")>0 ) {
				var duration = Math.floor( 500 * Math.random()) + 500;
				item.fadeIn(duration, function() {
					$(this).fadeOut( duration, function() {
						self.waterAnimation($(this));
					});
				});
		}
	},
	showShowerWater : function(frequency) {
		
			for ( var i = -1; i < 5 ; i++ ) {
				var wateritem = $('#water-item-' + (i+1) );
				if ( i < frequency) {
					
					if ( !(wateritem.data('show')  && wateritem.data("show")>0)) {
						wateritem.data('show',1);
						this.waterAnimation(wateritem);
					}
					
				} else {
					wateritem.data('show',-1);
					$('#water-item-' + (i+1) ).hide();
				}
		}
	},
	initQuestionHint : function() {
		//this.el.find('.drink').hint('#hint-drink');
	},
	initAnswerTooltip : function() {
		this.el.find('.cleaning-tool,.cleaning-style,.cleaning-care').tooltip();
	}
}