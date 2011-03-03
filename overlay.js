USGSOverlay.prototype = new google.maps.OverlayView();

function USGSOverlay(bounds, image, map) {
    
    // Now initialize all properties.
    this.bounds_ = bounds;
    //this.image_ = image;
    this.map_ = map;
    this.overlayProjection = null;
    // We define a property to hold the image's div. We'll 
    // actually create this div upon receipt of the onAdd() 
    // method so we'll leave it null for now.
    this.div_ = null;
    
    // Explicitly call setMap on this overlay
    this.setMap(map);
}
var event_tmp = 0;
USGSOverlay.prototype.onAdd = function() {
    
    // Note: an overlay's receipt of onAdd() indicates that
    // the map's panes are now available for attaching
    // the overlay to the map via the DOM.
    
    // Create the DIV and set some basic attributes.
    var div = document.createElement('DIV');
    div.style.borderStyle = "none";
    div.style.borderWidth = "0px";
    div.style.position = "absolute";
    
    
    //put some other canvas stuff in 
    var canvas = document.createElement("canvas");
    canvas.id = '_flock_canvas';
    sim.attatchToCanvas( canvas);
    div.appendChild(canvas);
   //add a mouse repulsive thing
    canvas.onclick = function(e){
	event_tmp = e;
	if( uiMode.key == 'president' )
	{
	    sim.attractors[0] = new attractor( 0.1,0.5, 2.0,0.4) ;
	    sim.attractors[0].pos.x = e.offsetX/canvas.width;
	    sim.attractors[0].pos.y = e.offsetY/canvas.height;	
	}
	else if	( uiMode.key == 'bomb' )
	{  
	    sim.attractors.push(new attractor( e.offsetX/canvas.width ,  e.offsetY/canvas.height, -10 ,0.1)) ;
	}
	else if	( uiMode.key == 'shooter' )
	{  
	    sim.attractors[1] = new attractor( e.offsetX/canvas.width ,  e.offsetY/canvas.height, -10 ,0.2) ;
	}
    }
  
    
    // Set the overlay's div_ property to this DIV
    this.div_ = div;
    
    // We add an overlay to a map via one of the map's panes.
    // We'll add this overlay to the overlayImage pane.
    var panes = this.getPanes();
    panes.overlayImage.appendChild(div);
   /* google.maps.event.addListener(this.map_, 'click', function(event) {
	var ltln = event.latLng;
	var pixloc = fromLatLngToDivPixel( ltln);
	_log += '\n' + (pixloc.toString()) ;
    })
*/
    
}
USGSOverlay.prototype.draw = function() {
    
    // Size and position the overlay. We use a southwest and northeast
    // position of the overlay to peg it to the correct position and size.
    // We need to retrieve the projection from this overlay to do this.
    this.overlayProjection = this.getProjection();
    
    // Retrieve the southwest and northeast coordinates of this overlay
    // in latlngs and convert them to pixels coordinates.
    // We'll use these coordinates to resize the DIV.
    var sw = this.overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = this.overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    
    // Resize the image's DIV to fit the indicated dimensions.
    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
    // resize the canvas
    var flock_can = document.getElementById('_flock_canvas');
    flock_can.width = (Math.abs(ne.x - sw.x));
    flock_can.height = (Math.abs(sw.y - ne.y));
    drawEm(sim);
}

USGSOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
}

