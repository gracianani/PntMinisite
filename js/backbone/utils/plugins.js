// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

//add indexOf in IE8 
(function() {
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt) return from;
        }
        return -1;
    };
}	
}());
// Place any jQuery/helper plugins in here.
function spinner(holderid, R1, R2, count, stroke_width, colour) {
	if ( !supportsSvg()) {
		return;
	}
var sectorsCount = count || 12,
			color = colour || "#fff",
			width = stroke_width || 15,
			r1 = Math.min(R1, R2) || 35,
			r2 = Math.max(R1, R2) || 60,
			cx = r2 + width,
			cy = r2 + width,
			r = Raphael(holderid, r2 * 2 + width * 2, r2 * 2 + width * 2),
 
			sectors = [],
			opacity = [],
			beta = 2 * Math.PI / sectorsCount,
 
	pathParams = {stroke: color, "stroke-width": width, "stroke-linecap": "round"};
	Raphael.getColor.reset();
	for (var i = 0; i < sectorsCount; i++) {
		var alpha = beta * i - Math.PI / 2,
				cos = Math.cos(alpha),
				sin = Math.sin(alpha);
		opacity[i] = 1 / sectorsCount * i;
		sectors[i] = r.path([
			["M", cx + r1 * cos, cy + r1 * sin],
			["L", cx + r2 * cos, cy + r2 * sin]
		]).attr(pathParams);
		if (color == "rainbow") {
			sectors[i].attr("stroke", Raphael.getColor());
		}
	}
	var tick;
	(function ticker() {
		opacity.unshift(opacity.pop());
		for (var i = 0; i < sectorsCount; i++) {
			sectors[i].attr("opacity", opacity[i]);
		}
		r.safari();
		tick = setTimeout(ticker, 1000 / sectorsCount);
	})();
	return function () {
		clearTimeout(tick);
		r.remove();
	};
}

$.prototype.tooltip = function() {
	var self = this;
	var tooltipDiv = $('#tooltip');
	var isMob = isMobile();
	var startEv = 'mouseenter';
	var endEv = 'mouseleave';
	
	if ( isMob ) {
		startEv = 'touchstart';
		endEv = 'touchend';
	}
	
	$(this).on(startEv, function(e) {
		tooltipDiv.show();
		tooltipDiv.find('.content').html($(this).attr('title'));
		var offset = $(e.currentTarget).offset();
		tooltipDiv.css('left',offset.left  - tooltipDiv.width()/2).css('top',offset.top - tooltipDiv.height()-30);
		if ( isMob ) {
		tooltipDiv.delay(1000).fadeOut('fast');
		}
		//e.stopPropagation();
	});
	if ( !isMob ) {
		$(this).on(endEv, function() {
			tooltipDiv.hide();
			tooltipDiv.find('.content').html("");
		});
	} else {
		
	}
	
}

$.prototype.hint = function(id) {
	var self = this;
	var hintDiv = $(id);
	var isMob = isMobile();
	if ( isMob ) {
		hintDiv.show();
		return;
	} 
	$(this).on('mouseenter', function() {
		hintDiv.show();
	});
	$(this).on('mouseleave', function() {
		hintDiv.hide();
	});
}

$.prototype.setDegree = function (defaultDegree) {
    var data = $(this).data('dragcircle');
    var degree, angle;
    if (data) {
        if ( ! data.radius ) 
                {
					data.radius = data.$circle.height() / 2;
					data.startX =  data.$circle.offset().left;
					data.startY =  data.$circle.offset().top;
                    data.centerX = data.$circle.position().left + data.radius;
                    data.centerY = data.$circle.position().top + data.radius;
                    $( this ).data('dragcircle', data );
        }

        if (defaultDegree) {
            degree = defaultDegree;
            var angleDegree = defaultDegree - 1 - Math.ceil(data.degree / 2);
            angle = (angleDegree - 0.5) / data.degree * 2 * Math.PI;
        } else {
         
            degree = Math.ceil(data.angle / (2 * Math.PI / data.degree)),
			angle = (degree - 0.5) / data.degree * 2 * Math.PI;
            degree = degree + Math.ceil(data.degree / 2) + 1;

        }
        if (degree > data.degree) {
            degree = degree - data.degree;
        }
        $(this).data('degree', degree);
		
        $(this).css({ top: data.centerY + Math.cos(angle) * data.radius,
            left: data.centerX + Math.sin(angle) * data.radius
        }).rotate(angle);
        
    }
}
$.prototype.rotate = function(angle) {
	if ( isSmallScreen() ) {
		var deg = 180 - angle * 180 / Math.PI + 'deg';
		$(this).css({
			'transform':'rotate('+deg+')',
			'-webkit-transform':'rotate('+deg+')',
			'-ms-transform':'rotate('+deg+')'
		});

	} else {
		var deg = 180 - angle * 180 / Math.PI + 'deg';
		$(this).css({
			'transform':'rotate('+deg+')',
			'-webkit-transform':'rotate('+deg+')',
			'-ms-transform':'rotate('+deg+')'
		});
	}
		
	
	
}
$.prototype.flyToAndHide = function(target, callback) {
	var item = $(this).show().css("visibility","visible");
	var originPosition = item.position();
	var originOffset = item.offset();
	var targetOffset = target.offset();
	var deltaX = targetOffset.left - originOffset.left + originPosition.left;
	var deltaY = targetOffset.top - originOffset.top + originPosition.top;
	
	item.animate({
		"left":deltaX,
		"top":deltaY,
		"opacity":0
	},1000, function(){
		$(this).attr("style","");
		callback.apply();
	});
}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function geDegreeByXPosition( left, parentWidth, degreeCount ) {
	var stepLength = parentWidth / ( (degreeCount - 1) * 2);
	
	var step = Math.floor( left / stepLength ) + 1;
	var degree = Math.floor(step / 2 ) + 1;
	return degree;
}

function drawArc(xloc, yloc,start, value, total, R) {
		    	var alpha = 360 / total * start,
		    	beta = 360/total * value,
		        a = (60 - alpha) * Math.PI / 180,
		        b = (60 - beta - alpha ) * Math.PI / 180,
		        xa = xloc + R * Math.cos(a),
		        ya = xloc - R * Math.sin(a),
		        xb = xloc + R * Math.cos(b),
		        yb = yloc - R * Math.sin(b),
		        path;
		    if (total == value) {
		        path = [
		            ["M", xloc, yloc - R],
		            ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
		        ];
		    } else {
		        path = [
		            ["M", xa, ya],
		            ["A", R, R, 0, +(beta > 180), 1, xb, yb]
		        ];
		    }
		    return {
		        path: path
		    };
}
function isMobile() {
	// Detect touch support
	$.support.touch = 'ontouchend' in document;
	return $.support.touch;
}
jQuery.fn.disableTextSelect = function() {
	return this.each(function() {
		$(this).css({
			'MozUserSelect':'none',
			'webkitUserSelect':'none'
		}).attr('unselectable','on').bind('selectstart', function(event) {
			event.preventDefault();
			return false;
		});
	});
};
 
jQuery.fn.enableTextSelect = function() {
	return this.each(function() {
		$(this).css({
			'MozUserSelect':'',
			'webkitUserSelect':''
		}).attr('unselectable','off').unbind('selectstart');
	});
};
function unique(data){  
    data = data || [];  
        var a = {};  
    for (var i=0; i<data.length; i++) {  
        var v = data[i];  
        if (typeof(a[v]) == 'undefined'){  
            a[v] = 1;  
        }  
    };  
    data.length=0;  
    for (var i in a){  
        data[data.length] = i;  
    }  
    return data;  
}  
function isSmallScreen() {
	return ($(window).width() < 1024); 
}
function supportsSvg() {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.1")
}
