function patch()
{
    //this is where neighbor info goes
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
		var mr = Math.round;
		var pix = context_polygon.getImageData(mr(x/w * canvas_polygon.width),mr(y/w * canvas_polygon.height),1,1).data; 
		if( pix[0] > 0 || pix[1] > 0 || pix[2] > 0 ){
		   this.patches[x][y] = 1; 
		}
	    }
	}
    }
}