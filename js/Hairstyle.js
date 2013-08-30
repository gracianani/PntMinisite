
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
		
		$('#character-container').removeClass('hidden').addClass('mirror-show');;
	},
	init : function() {
		var self = this;
		this.el = $('#scene-hairstyle').removeClass('hidden');
		
		AnimationHandler.initialize('#scene-hairstyle-content');
		
		this.initQuestionHint();
		this.initAnswerTooltip();
		
		
		$('#hairstyle-length .hairstyle-circle-dragable').data('dragcircle',{
			$circle: $('#hairstyle-length .hairstyle-circle'),
            degree:5
		}).data('degree',1);
		$('#hairstyle-curl .hairstyle-circle-dragable').data('dragcircle',{
			$circle: $('#hairstyle-curl .hairstyle-circle'),
            degree:4
		}).data('degree',1);
		
		$('.hairstyle-circle').click(function(event){
			var $circle = $(this);
			var data = $circle.find('.hairstyle-circle-dragable').data('dragcircle');
			
			if ( ! data.radius ) 
            {
                	
				data.radius = data.$circle.height() / 2;
				data.startX =  data.$circle.offset().left;
				data.startY =  data.$circle.offset().top;
                 data.centerX = data.$circle.position().left + data.radius;
                data.centerY = data.$circle.position().top + data.radius;
                        
               $circle.find('.hairstyle-circle-dragable').data('dragcircle', data );
                        
            }
           angle = Math.atan2( event.pageX - data.centerX - data.startX, event.pageY - data.centerY - data.startY );
           data.angle = angle;

           $circle.find('.hairstyle-circle-dragable').setDegree();
		   
		   self.setHairStyle({
					length:$('#hairstyle-length .hairstyle-circle-dragable').data('degree'),
					curl:$('#hairstyle-curl .hairstyle-circle-dragable').data('degree')
			})
            
		});
		
		
		$('#hairstyle-length .hairstyle-circle-dragable,#hairstyle-curl .hairstyle-circle-dragable').draggable({
			start: function(event,ui){
				var data = $( this ).data('dragcircle');
                if ( ! data.radius ) 
                {
                	
						data.radius = data.$circle.height() / 2;
						data.startX =  data.$circle.offset().left;
						data.startY =  data.$circle.offset().top;
                        data.centerX = data.$circle.position().left + data.radius;
                        data.centerY = data.$circle.position().top + data.radius;
                        
                        $( this ).data('dragcircle', data );
                        
               }

			},
			drag: function(event,ui) {
				var data = $( this ).data('dragcircle'),
                angle = Math.atan2( event.pageX - data.centerX - data.startX, event.pageY - data.centerY - data.startY );
                
                data.angle = angle;
                
                ui.position.top = data.centerY + Math.cos( angle )*data.radius;
                ui.position.left = data.centerX + Math.sin( angle )*data.radius;
                
			},
			stop: function(event,ui){
				$(this).setDegree();
				
				self.setHairStyle({
					length:$('#hairstyle-length .hairstyle-circle-dragable').data('degree'),
					curl:$('#hairstyle-curl .hairstyle-circle-dragable').data('degree')
				})
			}
			
			
		});
		
		
		
		$('#hand,#pin,#band').click(function(){
			self.setHairStyle({ type: $(this).attr('id') })
		});
		$('#comb').click(function() {
			self.setHairStyle({
					length:$('#hairstyle-length .hairstyle-circle-dragable').data('degree'),
					curl:$('#hairstyle-curl .hairstyle-circle-dragable').data('degree')
			})
		});
		
		
		$('#haircolor-black').click(function(){
			
			$('.hair').removeClass('hair-gold').removeClass('hair-mix').addClass('hair-black');
			$('.bang').removeClass('bang-gold').removeClass('bang-mix').addClass('bang-black');	
			$('#hairstyle-color').removeClass('gold mixed red').addClass('black');
		});
		$('#haircolor-gold').click(function(){
			$('.hair').removeClass('hair-black').removeClass('hair-mix').addClass('hair-gold');
			$('.bang').removeClass('bang-black').removeClass('bang-mix').addClass('bang-gold');
			$('#hairstyle-color').removeClass('black mixed red').addClass('gold');
		});
		$('#haircolor-red').click(function(){
			$('.hair').removeClass('hair-gold').removeClass('hair-mix').removeClass('hair-black');
			$('.bang').removeClass('bang-gold').removeClass('bang-mix').removeClass('bang-black');
			$('#hairstyle-color').removeClass('gold mixed red').addClass('black');
		});
		
		
		
	},
	initQuestionHint : function() {
		//this.el.find('.drink').hint('#hint-drink');
	},
	initAnswerTooltip : function() {
		//this.el.find('.cleaning-tool,.cleaning-style,.cleaning-care').tooltip();
	},
	setHairStyle : function(obj) {
		var hairData = {
			length : "m",
			curl : "1"
		}
		if (obj.type ) {
			$('.hair').attr('class',"hair hair-fm-" + obj.type);
			$('.bang').attr('class',"bang bang-fm-" + obj.type);
			return;
		}
		if ( obj.length ) {
			switch ( obj.length ) {
				case 1:
				hairData.length = "xs";
				break;
				case 2:
				hairData.length = "s";
				break;
				case 3:
				hairData.length = "m";
				break;
				case 4:
				hairData.length = "l";
				break;
				case 5:
				hairData.length = "xl";
				break;
			}
		}
		if ( obj.curl ) {
			hairData.curl = "" + obj.curl;
		}
		
		var str = hairData.length + "-" + hairData.curl;
		$('.hair').attr('class',"hair hair-fm-"+str);
		$('.bang').attr('class',"bang bang-fm-"+str);
	}
}


$.prototype.setDegree = function(defaultDegree) {
	var data = $( this ).data('dragcircle');
	var degree, angle;
	if ( data ) {
		if ( defaultDegree ) {
			degree = defaultDegree;
			var angleDegree = defaultDegree - 1 - Math.ceil(data.degree / 2);
			angle = (angleDegree - 0.5) / data.degree * 2 * Math.PI;
		} else {
			degree = Math.ceil(data.angle / (2 * Math.PI / data.degree ) ),
			angle = (degree - 0.5) / data.degree * 2 * Math.PI;

			degree = degree + Math.ceil(data.degree / 2) + 1 ;
		}
		
				
		if ( degree > data.degree ) {
			degree = 1;
		}
		
		$(this).data('degree', degree );	
				
		
		$(this).css({ top:data.centerY + Math.cos( angle )*data.radius,
				left:data.centerX + Math.sin( angle )*data.radius
		});
	}
}