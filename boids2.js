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
	var newvec = this.pos.clone();
	newvec.x += newvec.vx * this.speed;
	newvec.y += newvec.vy * this.speed;

	if( newvec.x >= 0 && newvec.y >= 0 && newvec.x <= 1 && newvec.y <= 1)
	{
	    this.pos = newvec;
	}
    }

    this.isMoveGood = function()
    {
	return mySimulator.isMoveGood( this);
    }

    this.applyForces = function()
    {
// TODO  put a more eficciant thing here like a quad tree or patch
	var forces = new vec(0,0,0,0);
	var tmpvec = new vec(0,0,0,0);
	var tmpdistance = 0;
	for(var i in this.mySimulator.flock)
	{
	    var chik = this.mySimulator.flock[i];
	    tmpdistance = distance(chik, this);

	    if( tmpdistance < this.r_repel && tmpdistance != 0 )//in repel distance
	    {   
		//repel
		tmpvec.vx = this.pos.vx - chik.pos.vx;// oppisite direction of neighbor
		tmpvec.vy = this.pos.vy - chik.pos.vy;
		tmpvec.normalize();
		
		forces.vx += tmpvec.vx* this.r_repel / Math.pow( tmpdistance, 2);
		forces.vy += tmpvec.vy* this.r_repel/ Math.pow( tmpdistance, 2);
	    }
	    else if( distance(chik, this) < this.r_attract )//attract distance
	    {
		//attract
		tmpvec.vx = chik.pos.x - this.pos.x;
		tmpvec.vy = chik.pos.y - this.pos.y;
		tmpvec.normalize();
		forces.vx += tmpvec.vx * (this.r_attract - tmpdistance) / 20; 
		forces.vy += tmpvec.vy * (this.r_attract - tmpdistance) / 20; 
		//follow
		forces.vx += chik.pos.vx * (this.r_attract - tmpdistance)/ this.r_attract; 
		forces.vy += chik.pos.vy * (this.r_attract - tmpdistance )/this.r_attract ;
		//match speed
		if( chik.speed < this.speed && this.speed > 0){
		    this.speed -= (this.speed - chik.speed)/(tmpdistance*100);
		}
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
	    }
	}
	forces.normalize();

	// it hit a walls
	if( ! this.isMoveGood() )
	{
	    forces.vx += -this.pos.vx * 2 + 2*Math.random()-1;
	    forces.vy += -this.pos.vy * 2 + 2*Math.random()-1;
	    this.pos.x = this.pos.x - this.pos.vx *speed;
	    this.pos.y = this.pos.y - this.pos.vy  *speed;

	   // this.speed = 0;
	    this.speed * 0.9;    
	}
	forces.normalize();

	this.pos.vx += forces.vx;
	this.pos.vy += forces.vy;
	this.pos.normalize();


	// get speed closer to average speed
	this.speed += (this.average_speed  - this.speed) / 20

    }
}
