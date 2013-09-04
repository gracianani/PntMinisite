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

// Place any jQuery/helper plugins in here.
function spinner(holderid, R1, R2, count, stroke_width, colour) {
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
	
	
	$(this).on('mouseenter', function() {
		tooltipDiv.show();
		tooltipDiv.find('.content').html($(this).attr('title'));
		var offset = $(this).offset();
		tooltipDiv.css('left',offset.left - 20).css('top',offset.top - tooltipDiv.height()-20);
	});
	$(this).on('mouseleave', function() {
		tooltipDiv.hide();
		tooltipDiv.find('.content').html("");
	});
}

$.prototype.hint = function(id) {
	var self = this;
	var hintDiv = $(id);
	
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
        console.log(degree);
        $(this).css({ top: data.centerY + Math.cos(angle) * data.radius,
            left: data.centerX + Math.sin(angle) * data.radius
        }).rotate(angle);
    }
}
$.prototype.rotate = function(angle) {
	var deg = 180 - angle * 180 / Math.PI + 'deg';
	console.log(deg);
	$(this).css({
		'transform':'rotate('+deg+')',
		'-webkit-transform':'rotate('+deg+')',
		'-ms-transform':'rotate('+deg+')'
	});
	
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