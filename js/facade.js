window.AppFacade = {
            states: {},
            init : function() {
	            	
	            	SM.RegisterState( "diet", DietState );
	            	SM.RegisterState( "health", HealthState );
	            	this.initLoading();
	            		            	
            },
            initLoading : function() {
	            this.loadingView = new LoadingView();
            },
            initBasicFrame : function() {
	            this.basicFrame = new BasicFrameView();
            },
            enterDietScene : function() {
	          
	          SM.SetStateByName("health"); 
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

