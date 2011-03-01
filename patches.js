function aPatch(open)
{
    this.occupants = [];
    this.open = 0;
    if(open)
	this.open = open;
    //this is where neighbor info goes
}

function patchArray(w,h)
{
    this.width = w;
    this.height = h;
    this.patches = new Array(w);

    this.cleanHood = function()
    {
	for( var x=0;x < this.width; x++)
	{
	    for( var y=0;  y < this.height; y++)
	    {
		this.patches[x][y].occupants = [];
	    } 
	}
    }

    this.init = function()
    {
	for( var x=0; x < this.width ; x++)
	{
	    this.patches[x] = new Array(h);
	    for( var y=0; y < this.height; y++)
	    {
		this.patches[x][y] = new aPatch(1);
		try
		{
		    if(context_polygon)
		    {
			var mr = Math.floor;
			var pix = context_polygon.getImageData(mr(x/this.width * context_polygon.canvas.width),mr(y/this.width * context_polygon.canvas.height),1,1).data; 
			if( pix[0] > 0 || pix[1] > 0 || pix[2] > 0 ){
			    this.patches[x][y] = new aPatch(1); 
			}
			else
			{
			    this.patches[x][y] = new aPatch(0); 
			}
		    }
		}
		catch(e)
		{
		    
		}
	    }
	}
	this.cleanHood();
    //return this;
    }

    this.whatsAt = function(x,y)
    {
	var x2 = Math.round( x * this.width);
	var y2 = Math.round( y * this.height);
	if(x2 < this.width && y2 < this.height && x2 >= 0 && y2 >= 0)
	    return this.patches[x2][y2];
	return new aPatch(0);
    }
    this.isInBounds = function(x,y)
    {
	if( this.whatsAt(x,y).open == 0)
	    return false;
	return true;
    }
    this.registerMe = function( chik )
    {
	this.whatsAt( chick.pos.x, chick.pos.y ).occupants.push( chik);
    }

    this.neighbors = function(bx,by,br)
    {
	if( !bx || !by || !br)
	    return null;

	var hood1 = [];
	for( var x=-br; x < br; x = x + 1/this.height)
	{
	    for( var y=-br; y< br ; y= y + 1/this.width)
	    {
		var nei = this.whatsAt( bx + x, by + y);
		for( n in nei.occupants)
		{
		    hood1.push(nei.occupants[n]);
		}
	
	    } 
	}

	return hood1;
    }

//call this at beginning
    this.init();

}

