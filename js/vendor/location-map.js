// Thanks to Mathias Pettersson for the initial inspiration: 
//   http://github.com/mape
// See also the PeepCode Screencast on Node.js
//   https://peepcode.com/products/nodejs-i

function LocationMap() {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  this.init = function() {
    self.drawMap();
    self.viewDidResize();

    // Sample locations:

  //  self.drawMarker({  latitude:'51.5'
  //                    , longitude:'-0.1'
  //                    , city:"London"
  //                    , title:'14ºC'});
  // 
  };

  this.drawMap = function () {
    self.map = Raphael('location_map', 0, 0);
	if(jQuery.browser.msie){
		self.map.canvas.setAttribute('viewBox', '0 0 703 399');
	}else{
		self.map.canvas.setAttribute('viewBox', '0 0 603 299');
	}
    

    self.map.path(mapPath).attr({
        stroke: 'black'
      , fill: '#10afb5'
      , 'stroke': 0
    });
  }

  this.viewDidResize = function () {
    var width = 783,
      windowHeight = jQuery(window).height(),
      mapCanvasHeight = 783 * (443.0 / 783.0);
if(jQuery.browser.msie){
    self.map.setSize(900, mapCanvasHeight);
	jQuery(self.map.canvas).css("margin-left", "55px");
}else{
	self.map.setSize(width, mapCanvasHeight);
}



  }

  this.geoCoordsToMapCoords = function (latitude, longitude) {
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    var mapWidth = 609,
      mapHeight = 306,
      x, y, mapOffsetX, mapOffsetY;

    x = (mapWidth * (180 + longitude) / 360) % mapWidth;

    latitude = latitude * Math.PI / 180;
    y = Math.log(Math.tan((latitude / 2) + (Math.PI / 4)));
    y = (mapHeight / 2) - (mapWidth * y / (2 * Math.PI));

    mapOffsetX = mapWidth * 0.017;
    mapOffsetY = mapHeight * 0.089;

    return {
      x: (x - mapOffsetX) * 0.98,
      y: (y + mapOffsetY + 15),
      xRaw: x,
      yRaw: y
    };
  }

  this.drawMarker = function (message) {
	
    var latitude = message.latitude,
      longitude = message.longitude,
      text = message.title,
      city = message.city,
      x, y;

    var mapCoords = this.geoCoordsToMapCoords(latitude, longitude);
    x = mapCoords.x;
    y = mapCoords.y;
	if(typeof self.person != "undefined"){
		jQuery(self.person.node).remove();
	}
	
	if(typeof self.flag != "undefined"){
		jQuery(self.flag.node).remove();
	}
	
	
	
	self.flag = self.map.path(flagPath);
	self.flag.scale(0.8, 0.8);
    self.flag.translate(-35, -34); // Reset location to 0,0
   	self.flag.translate(x, y);
	self.flag.attr({
        fill: '#E84A4F'
        ,stroke: 'transparent'
    });
	
    self.person = self.map.path(personPath);
    self.person.scale(0.8, 0.8);
    self.person.translate(-5, -39); // Reset location to 0,0
   	self.person.translate(x, y);
    self.person.attr({
        fill: '#000'
        ,stroke: 'black'
		,"stroke-width":2
    });

    // var title = self.map.text(x, y + 11, text);
    // title.attr({
    //     fill: 'black'
    //   , "font-size": 10
    //   , "font-family": "'Helvetica Neue', 'Helvetica', sans-serif"
    //   , 'font-weight': 'bold'
    // });
    // var subtitle = self.map.text(x, y + 21, city);
    // subtitle.attr({
    //     fill: '#999'
    //   , "font-size": 7
    //   , "font-family": "'Helvetica Neue', 'Helvetica', sans-serif"
    // });

    var hoverFunc = function () {
      self.person.attr({
        fill: 'white'
      });
      // jQuery(title.node).fadeIn('fast');
      // jQuery(subtitle.node).fadeIn('fast');
    };
    var hideFunc = function () {
      self.person.attr({
        fill: '#ff9'
      });
      // jQuery(title.node).fadeOut('slow');
      // jQuery(subtitle.node).fadeOut('slow');
    };
    jQuery(self.person.node).hover(hoverFunc, hideFunc);
	
    // self.person.animate({
    //   scale: '0.6, 0.6'
    // }, 2000, 'elastic', function () {
    //   // jQuery(title.node).fadeOut(5000);
    //   // jQuery(subtitle.node).fadeOut(5000);
    // });
  }

  this.init();
  return self;

}


