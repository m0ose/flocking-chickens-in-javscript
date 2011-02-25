//
//
/*
Bird flocking with chickens
 cody smith

so the boundries are 0 and 1. no bird can go beyond those. 
  hence, every position is a ratio of its position / dimension.  


*/
var __twopi = 2 * Math.PI;
//var flock = [];// all of the chickens
var attractors = [];// this is attractors and repellers
//var boundry; // image with boundry


//
// var v = new vec(0,0,0,0);
//    v.x = 23; 
//
function vec( x,y,vx,vy)
{
    this.x = Number(x);
    this.y = Number(y);
    this.vx = Number(vx);
    this.vy = Number(vy);
    
    this.clone = function()
    {
	return new vec(Number(this.x), Number(this.y), Number(this.vx), Number(this.vy) ); 
    }

    this.normalize = function()
    {
	if( this.vx == 0 && this.vy == 0)
	{
	    this.vx = this.vy = 0;
	} 
	else
	{
	    var mag = Math.sqrt( this.vx * this.vx + this.vy * this.vy);
	    this.vx = this.vx / mag;
	    this.vy = this.vy /mag;
	}
	return this;
    }
    this.toString2 = function()
    {
	return new String( " " + this.x + "," + this.y + "  ,  " + this.vx + "," + this.vy ); 
    }
}
function distance(va,vb)//distance between two birds
{
   var res = 0 ; 
   if( va.constructor.name == 'chicken')
    {
	res = Math.pow(vb.pos.x - va.pos.x,2) + Math.pow(vb.pos.y - va.pos.y, 2 );
    }	
    else // if vec
    {
	res = Math.pow(vb.x - va.x,2) + Math.pow(vb.y - va.y, 2 );
    }
    res = Math.sqrt(res); 
    return res;

}



function attractor(x,y, force, radius)
{
    this.pos = new vec(x,y,0,0);
    this.force = force;
    this.radius = radius;
}

function chicken( x,y, attract_radius, repel_radius, speed , mySimulator)
{
    this.pos = new vec( x, y, Math.random() * __twopi, Math.random() * __twopi);//random orientation
    this.r_attract = attract_radius;
    this.r_repel = repel_radius;
    this.pos.normalize();
    this.speed = speed;
    this.average_speed = speed;
    this.mySimulator = mySimulator;

    
    this.move = function()
    {
	if(  this.isMoveGood() )
	{
	    var newvec = this.pos.clone();
	    newvec.x += newvec.vx * this.speed;
	    newvec.y += newvec.vy * this.speed;
	    
	    this.pos = newvec;
	}
	//register where this chicken is now
	this.mySimulator.myPatch.whatsAt( this.pos.x, this.pos.y ).occupants.push( this);
    }

    this.isMoveGood = function()
    {
	return mySimulator.isMoveGood( this);
    }

    this.applyForces = function()
    {
// TODO  put a more eficciant thing here like a quad tree or patch

	// it hit a walls
	if( ! this.isMoveGood() )
	{ 
	    this.pos.vx = 2*Math.random() - 1;
	    this.pos.vy = 2*Math.random() - 1;
	}

	if( this.isMoveGood())
	{
	    var forces = new vec(0,0,0,0);
	    var tmpvec = new vec(0,0,0,0);
	    var tmpdistance = 0;

	    var biggerR = this.r_attract;
	    if( this.r_repel > this.r_attract )
		biggerR = this.r_repel;

	    var chik;
	    var myHood = this.mySimulator.myPatch.neighbors( this.pos.x, this.pos.y, biggerR) 
	    for( var i in myHood )
	    {
		if( i >20)
		    break;

		chik = myHood[i];
		tmpdistance = distance(chik, this);
		
		if( tmpdistance < this.r_repel && tmpdistance != 0)//in repel distance
		{   
		    //repel
		    tmpvec.vx = this.pos.x - chik.pos.x;// oppisite direction of neighbor
		    tmpvec.vy = this.pos.y - chik.pos.y;
		    //tmpvec.normalize();
		    
		    forces.vx +=tmpvec.vx* 100///( 1 - (tmpdistance/this.r_repel )  ); /// Math.pow( tmpdistance, 2);
		    forces.vy +=tmpvec.vy* 100///( 1 - (tmpdistance/this.r_repel )  );  /// Math.pow( tmpdistance, 2);
		   // if( tmpdistance < this.r_repel/2)
			//this.speed = this.speed * 0.9;
		}
		if( distance(chik, this) < this.r_attract )//attract distance
		{
		    //attract
		    tmpvec.vx = chik.pos.x - this.pos.x;
		    tmpvec.vy = chik.pos.y - this.pos.y;
		    tmpvec.normalize();
		    forces.vx += tmpvec.vx * (tmpdistance/ this.r_attract)/15 ; 
		    forces.vy += tmpvec.vy * (tmpdistance/ this.r_attract)/15 ; 
		    //follow
		    forces.vx += (chik.pos.vx * (tmpdistance/ this.r_attract))/5; 
		    forces.vy += (chik.pos.vy * (tmpdistance /this.r_attract ))/5;
		    
		  //  }
		}	
	    }
	    
	    // ATTRACTORS AND REPULSORS
	    for( var j in this.mySimulator.attractors)
 	     {
		var atr = this.mySimulator.attractors[j];
		var dist = distance( atr.pos, this.pos);
		
		if( dist <= atr.radius)
		{
		    tmpvec.vx = atr.pos.x - this.pos.x;
		    tmpvec.vy = atr.pos.y - this.pos.y;
		    tmpvec.normalize();
		    forces.vx += tmpvec.vx * atr.force * ( dist/atr.radius);
		    forces.vy += tmpvec.vy * atr.force * (dist/atr.radius);
		    
		    //speed
		    if(atr.force > 0 )// is attractor
			this.speed = this.speed;//this.average_speed * Math.sin( (dist / atr.radius));
		    else// is reppelor
		    {	
			this.speed = this.average_speed /(Math.pow(dist / atr.radius, 2) )//this.average_speed * 5;//this.average_speed * Math.abs( atr.force );	
		    }
		}
	    }
	    //forces.normalize();
	    
	    {
		forces.normalize();
		
		this.pos.vx += forces.vx;
		this.pos.vy += forces.vy;
		this.pos.normalize();
	    }
	}
    }
    // get speed closer to average speed
    if( this.speed > 4 * this.average_speed )
	this.speed = 4 * this.average_speed;
    this.speed += (this.average_speed  - this.speed) / 20;	
    
}



//test function
var _testlog = [];
function testPatches( patch)
{
    if(!patch)
	return;

	for( var x=0;x < patch.width; x++)
	{
	    for( var y=0;  y < patch.height; y++)
	    {

		if( patch.patches[x][y].occupants.length > 0 )
		    _testlog.push( " ("+x+","+y+")  ") ;
	    }
	}
}