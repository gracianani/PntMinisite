var AnimationHandler = {
    initialize: function (contentID) {
        var self = this;
        self.contentID = contentID;
        self.animateObjects();
    },
    animateObjects: function () {
		if ( isSmallScreen() ) {
			jQuery(this.contentID + ' .item').hide();
			return;
		}
        var self = this;
        self.el = jQuery(self.contentID);
        self.DISTANCE = 500;
        self.containerWidth = (self.el.width() / 2 - 300);
        self.containerHeight = (self.el.height() / 2);
        //jQuery('body').css('overflow', 'hidden');

        self.items = jQuery(self.contentID + " .item").length;
        var count = 0;

        jQuery(self.contentID + " .item").each(function (i) {

            var position = $(this).position();
            var left = position.left;
            var top = position.top;

            var pointWidth = left - self.containerWidth;
            var pointHeight = top - self.containerHeight;


            if (pointWidth < 0) {
                var angle = -30;
                var endX = left - 500;

            } else {
                var angle = 30;
                var endX = left + 500;
            } //angle is  -30 if off to the left, 30 if off to the right.

            var startX = (pointWidth * self.DISTANCE) / 2;
            var startY = (pointHeight + self.DISTANCE);
            var endY = (pointHeight + self.DISTANCE) * -15;


            var _b = {
                start: {
                    x: startX,
                    y: startY,
                    angle: angle
                },
                end: {
                    x: left,
                    y: top,
                    angle: angle,
                    length: 0.25,
                    easing: "easeOutBounce"
                }
            }

            var _c = {
                start: {
                    x: left,
                    y: top,
                    angle: angle
                },
                end: {
                    x: endX,
                    y: endY,
                    angle: angle,
                    length: 0.25
                }
            }


            var visible = jQuery(this).is(":visible") ? jQuery(this).css("display") : false;
            jQuery(this).data({ "in": _b, "out": _c, visible: visible });
            if (visible) {
                jQuery(this).hide();
            }



            /*
            jQuery(this).animate({path : new jQuery.path.bezier(_b)}, 1800, "easeOutQuint", function() {
            var ob = this;
            count++;
            if(count == self.items){
            self.callBack();
            jQuery('body').css('overflow','visible');
            }
                    
            });
            */


        });


    },
    animateIn: function () {
    	if ( isSmallScreen() ) {
    		var content = jQuery(this.contentID);
    		content.addClass('animated slideInDown');
    		content.find('.item:not(.onDesktop)').show();
    		var self = this;
    		var timer = setTimeout(function(){
	    		self.callBack();
    		}, 1500);

			return;
		}
        var self = this,
    			count = 0;
    	jQuery('body').css('overflow', 'hidden');
        jQuery(self.contentID + " .item").each(function (i) {
            var obj_data = jQuery(this).data();
            if (obj_data.visible) {
                jQuery(this).css("display", obj_data.visible);
            }
            jQuery(this).animate({ path: new jQuery.path.bezier(obj_data["in"]) }, 1800, "easeOutQuint", function () {
                var ob = this;
                count++;
                if (count == self.items) {
                    self.callBack();
                    //jQuery('body').css('overflow', 'visible');
                }
            });
        });
    },
    animateOut: function (type, postAnimateOut) {
    	if (isSmallScreen() ) {
    		var content = jQuery(this.contentID);
    		content.addClass('animated slideOutUp');
    		var timer = setTimeout(function(){
    			content.find('.item').hide();
	    		if (type == "next") {
	                 postAnimateOut();
	            }
	            else if (type == "report") {
	                 app.Views.BasicFrameView.showReport();
	                 postAnimateOut();
	             }
    		}, 1000);
    		
			return;
		}
        var self = this;
        var count = 0;
        //jQuery('body').css('overflow', 'hidden');
        var items = jQuery(self.contentID + " .item");
        if (items.length > 0) {
            items.each(function (i) {
                jQuery(this).animate({ path: new jQuery.path.bezier(jQuery(this).data().out) }, 1200, "easeInQuint", function () {
                    count++;
                    if (count == items.length) {
                    	jQuery('body').css('overflow', 'visible');
                        if (type == "next") {
                            postAnimateOut();
                        }
                        else if (type == "report") {
                            app.Views.BasicFrameView.showReport();
                            postAnimateOut();
                        }
                        else {
                        }
                    }
                });
            });

        }
        else {
            postAnimateOut();
        }


    },
    callBack: function () {

    }
};