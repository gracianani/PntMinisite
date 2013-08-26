window.AppFacade = {
            states: {},
            init : function() {
	            	
	            	SM.RegisterState( "life", LifeState );
	            	SM.RegisterState( "diet", DietState );
	            	SM.RegisterState( "health", HealthState );
	            	SM.RegisterState( "cleaning", CleaningState );
	            	this.initLoading();
	            	
	            	$('html').attr('unselectable','on')
				     .css({'-moz-user-select':'-moz-none',
				           '-moz-user-select':'none',
				           '-o-user-select':'none',
				           '-khtml-user-select':'none', /* you could also put this in a class */
				           '-webkit-user-select':'none',/* and add the CSS class here instead */
				           '-ms-user-select':'none',
				           'user-select':'none'
				     }).bind('selectstart', function(){ return false; });
	            		            	
            },
            initLoading : function() {
	            this.loadingView = new LoadingView();
            },
            initBasicFrame : function() {
	            this.basicFrame = new BasicFrameView();
            },
            enterDietScene : function() {
	          
	          SM.SetStateByName("cleaning"); 
	          this.onQuestionReady(); 
            },
            onQuestionReady : function() {
	            this.currentView.animateIn();
            },
            setCurrentView: function(view){
			    this.currentView = view;
			},
            getCurrentView: function() {
	            return this.currentView;
	        }
}


window.AppFacade.init();

