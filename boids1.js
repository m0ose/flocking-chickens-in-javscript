//
//
/*
Bird flocking with chickens
 cody smith

so the boundries are 0 and 1. no bird can go beyond those. 
  hence, every position is a ratio of its position / dimension.  


*/
var __twopi = 2 * Math.PI;
var flock = [];// all of the chickens
var attractors = [];// this is attractors and repellers

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




function chicken( x,y, attract_radius, repel_radius, speed)
{
    this.pos = new vec( x, y, Math.random() * __twopi, Math.random() * __twopi);//random orientation
    this.r_attract = attract_radius;
    this.r_repel = repel_radius;
    this.pos.normalize();
    this.speed = speed;
    this.average_speed = speed;

    
    this.move = function()
    {
	//TODO
//if x,y inbounds
//also in polygon
	var newvec = this.pos.clone();
	newvec.x += newvec.vx * this.speed;
	newvec.y += newvec.vy * this.speed;

	if( newvec.x >= 0 && newvec.y >= 0 && newvec.x <= 1 && newvec.y <= 1)
	{
	    this.pos = newvec;
	}
    }


    this.applyForces = function()
    {
// TODO  put a more eficciant thing here like a quad tree or patch
	var forces = new vec(0,0,0,0);
	var tmpvec = new vec(0,0,0,0);

	for(var i in flock)
	{

	    var chik = flock[i];
	    if( distance(chik,this) < this.r_repel )//in repel distance
	    {   
		//repel
		tmpvec.vx = this.pos.vx - chik.pos.vx;// oppisite direction of neighbor
		tmpvec.vy = this.pos.vy - chik.pos.vy;
		tmpvec.normalize();
		forces.vx += tmpvec.vx * 90;
		forces.vy += tmpvec.vy * 90;
	    }
	    else if( distance(chik, this) < this.r_attract )//attract distance
	    {
		//attract
		tmpvec.vx = chik.pos.x - this.pos.x;// direction of neighbor
		tmpvec.vy = chik.pos.y - this.pos.y;
		tmpvec.normalize();
		forces.vx += tmpvec.vx / 20;
		forces.vy += tmpvec.vy /20;
		//follow
		forces.vx += chik.pos.vx ;
		forces.vy += chik.pos.vy ;
	    }
	    //walls
	    if( this.pos.x + this.pos.vx * speed < 0 ) {
		forces.vx += -this.pos.vx * 10;
		this.speed = this.average_speed / 10;
	    }
	    else if( this.pos.x + this.pos.vx * speed > 1 ) {
		forces.vx += -this.pos.vx * 10;
		this.speed = this.average_speed / 10;
	    }
	    if( this.pos.y + this.pos.vy * speed < 0 ) {
		forces.vy += -this.pos.vy * 10;
	    	this.speed = this.average_speed / 10;
	    }
	    else if( this.pos.y + this.pos.vy * speed > 1 ) {
		forces.vy += -this.pos.vy * 10;	
	    	this.speed = this.average_speed / 10;
	    }
	}
	for( var j in attractors)
	{
	    var atr = attractors[j];
	    var dist = distance( atr.pos, this.pos);
	    
	    if( dist <= atr.radius)
	    {
		tmpvec.vx = atr.pos.x - this.pos.x;
		tmpvec.vy = atr.pos.y - this.pos.y;
		tmpvec.normalize();
		forces.vx += tmpvec.vx * atr.force;
		forces.vy += tmpvec.vy * atr.force;
	    }
	    // TODO:put attractor code here
	}
	//_testlog += " forces before normalize " + forces.toString2();
	forces.normalize();
	//_testlog += " forces after " + forces.toString2();
	this.pos.vx += forces.vx;
	this.pos.vy += forces.vy;
	this.pos.normalize();

	// get speed closer to average speed
	this.speed += (this.average_speed  - this.speed) / 20
    }
}

function attractor(x,y, force, radius)
{
    this.pos = new vec(x,y,0,0);
    this.force = force;
    this.radius = radius;
}