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