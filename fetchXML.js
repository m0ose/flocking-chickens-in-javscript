

ajax(0);//fetch the kml

var polygons = [];
polystring = "";

var imagedata_polygon;
var context_polygon;
//var _patches;

_log = "";

function point(_lon, _lat, _alt)
{
    this.lat = Number(_lat);
    this.lon = Number(_lon);
    if( !_alt){
	_alt = 0;
    }
    this.alt = Number(_alt);	
}
function rect()
{
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
}
function lineStrip()
{
    this.points=[];
}
//main function
function fetchMain()
{
    getPolys();
    boundingBox( polygons[0]);
    drawPolygon();
    //_patches = patchArray( 60,60);
}
function getPolys()
{
    var polys = xmlHTTP.responseXML.getElementsByTagName('Polygon');
    for( var i=0; i < polys.length; i++)
    {
	var resultLine = new lineStrip();

	var pol = polys[i];
	var coords = pol.getElementsByTagName('coordinates')[0];
	polystring = coords.textContent;
	var pointArray = coords.textContent.split(' ');
	for( var i in pointArray)
	{
	    var tmp = pointArray[i].split(',');
	    if( tmp.length > 1){
		resultLine.points.push( new point( tmp[0], tmp[1], tmp[2] ) ); 
	    }	
	}
	polygons.push(  resultLine );
    }

}

function boundingBox( line__strip )
{
    var minLat = 9999;
    var minLon = 9999;
    var maxLat = -9999;
    var maxLon = -9999;

   
    var points = line__strip.points;
    for(var  j in points)
    { 
	var pnt = points[j];
	if( pnt.lat < minLat ){
	    minLat = pnt.lat;
	}
	else if( pnt.lat > maxLat){
	    maxLat = pnt.lat
	}

	if( pnt.lon < minLon ){
	    minLon = pnt.lon;
	}
	else if( pnt.lon > maxLon){
	    maxLon = pnt.lon
	}
    }
   
    _log += ( "minlat" + minLat + " minlon" + minLon + " max " + maxLat + "," + maxLon);
    var resRect = new rect();
    resRect.x = minLon;
    resRect.y = minLat;
    resRect.height = Number(maxLat - minLat);
    resRect.width = Number(maxLon - minLon);
    return resRect;
}


function drawPolygon()
{


    var canvas_polygon ;
    if( document.getElementById('_can') ){
	canvas_polygon = document.getElementById('_can');
    }
    else{
	canvas_polygon = document.createElement('canvas');
	document.body.appendChild(canvas_polygon).id = '_can';
    }

   // document.getElementById("_can") = canvas;//comment out if this is to be invisible 
    
    var width = canvas_polygon.width = 640;//window.innerWidth - 100; // 640;//innerWidth;
    var height = canvas_polygon.height = 640;//window.innerHeight -100 //640;//innerHeight;
    context_polygon = canvas_polygon.getContext("2d");
    imagedata_polygon = context_polygon.getImageData(0,0, canvas_polygon.width, canvas_polygon.height);

    

    var recta = boundingBox( polygons[0] );

 
    var ratio = width / recta.width;
    if( recta.height > recta.width){
	ratio = height / recta.height;
    }

    context_polygon.beginPath();
    context_polygon.strokeStyle = 'blue';
    context_polygon.fillStyle = "rgb(200,0,0)"; 

    for( var i in polygons[0].points )
    { 	    
	var p = polygons[0].points[i];

	var x = (p.lon - recta.x)*ratio ;
	var y =  (p.lat - recta.y)*ratio;
	if( i == 0)
	    context_polygon.moveTo(x,y);
	else
	    context_polygon.lineTo(x,y);
	_log += "("+x+","+y+")";
    }
    context_polygon.fill();
    context_polygon.stroke();

    
}

function patchArray(w,h)
{
    this.width = w;
    this.height = h;
    this.patches = new Array(w);
    for( var x=0; x < w ; x++)
    {
	this.patches[x] = new Array(h);
	for( var y=0; y < h; y++)
	{
	    this.patches[x][y] = 0;
	    if(context_polygon)
	    {
		var mr = Math.floor;
		//var pix = context_polygon.getImageData(mr(x/w * canvas_polygon.width),mr(y/w * canvas_polygon.height),1,1).data; 
		var pix = context_polygon.getImageData(mr(x/w * context_polygon.canvas.width),mr(y/w * context_polygon.canvas.height),1,1).data; 

		if( pix[0] > 0 || pix[1] > 0 || pix[2] > 0 ){
		   this.patches[x][y] = 1; 
		}
	    }
	}
    }
    this.whatsAt = function(x,y)
    {
	var x2 = Math.floor( x * this.width);
	var y2 = Math.floor( y * this.height);
	if(x2 < this.width && y2 < this.height && x2 >= 0 && y2 >= 0)
	    return this.patches[x2][y2];
	return 0;
    }
    this.isInBounds = function(x,y)
    {
	if( this.whatsAt(x,y) == 0)
	    return false;
	return true;
    }
}

