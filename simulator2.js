function simulator()
{ 
    //simulation related variables
    this._iter_interval = null;
    this._draw_interval = null;
    this.flock = [];//array holding all chickens. like a hen house.
    this.attractors = [];
    this._usingBoundry = false;
    this._sim_log = "";
    this.simContext = null;
    this.patch = null;
    //chicken related variables
    this.flockSize;
    this.repelRadius;
    this.attractRadius;
    this.radiusVariation;
    this.speed;
    this.speedVariation;
    

    this.startSim = function( flockSize, repelRadius, attractRadius, radiusVariation,speed,speedVariation)
    {
	//var _mySelf = this;
	this.initSim( flockSize,repelRadius, attractRadius, radiusVariation,speed, speedVariation);
	this.stopSim();
	this._draw_interval = setInterval( drawEm, 50, this);
	this._iter_interval = setInterval ( this.iterate, 1);
    }
    this.stopSim = function()
    {
	if( this._iter_interval)
	    clearInterval( this._iter_interval);
	if( this._draw_interval)
	    clearInterval( this._draw_interval);
    }
//this makes a new canvas or attatches the drawing to a canvas
    this.attatchToCanvas = function( aCanvas)
    {
	if( !aCanvas)
	{
	    aCanvas = document.createElement("canvas");
	    aCanvas.width = aCanvas.height = 600;//window.innerHeight -24;
	    document.body.appendChild( aCanvas);
	    this.simContext = aCanvas.getContext("2d");
	}
	else
	{
	    this.simContext = aCanvas.getContext("2d");
	}
	//this.simContext = Z.getContext("2d");
	return aCanvas;
    }
    this.initSim = function( flockSize,repelRadius, attractRadius, radiusVariation,speed, speedVariation)
    {
	this.flockSize = flockSize;
	this.repelRadius = repelRadius;
	this.attractRadius=attractRadius;
	this.radiusVariation=radiusVariation;
	this.speed=speed;
	this.speedVariation=speedVariation;

	if( !flockSize)
	    this.flockSize = 30;
	if(!repelRadius)
	    this.repelRadius = 0.03;
	if(!attractRadius)
	    this.attractRadius = 0.05;
	if(!radiusVariation)
	    this.radiusVariation = 0.001;
	if(!speedVariation)
	    this.speedVariation = 0.001;
	if(!speed)
	    this.speed = 0.00015;
	try{
	    if( patches && patches.patches )
		usingBoundry = true;
	}
	catch(e)
	{
	    this._sim_log += "boundry not found . not using mapped boundry ";	
	}
	
	if(!this.flock)
	{
	    this.flock = [];
	}
	//
	// POPULATE THE FLOCK
	while( this.flock.length > this.flockSize){
	    this.flock.pop();
	} 
	while( this.flock.length < this.flockSize){
	    if(this._usingBoundry){
		var x = Math.random();
		var y = Math.random();
		while( !patches.isInBounds(x,y) )
		{
		    x += 1/41;
		    y += 1/71;
		    x = x % 1;
		    y = y % 1;
		}
		this.flock.push( new chicken( x, y, this.attractRadius + Math.random() * this.radiusVariation, this.repelRadius + Math.random() * this.radiusVariation, this.speed + Math.random() * this.speedVariation, this) );
	    }
	    else
	    {
		this.flock.push(
		    new chicken( Math.random(), Math.random(), this.attractRadius + Math.random() * this.radiusVariation, this.repelRadius + Math.random() * this.radiusVariation, this.speed + Math.random() * this.speedVariation, this) );
	    }
	}
	flock = this.flock;
	//
	//add some attractors
	this.attractors.push( new attractor( 0.1,0.5, -100,0.3) );
	this.attractors.push( new attractor( 0.5,0.6, 0.05,0.2) );
	this.attractors.push( new attractor( 1.5,0.6, 0.005,2) );
	


	attractors = this.attractors;

    }


    this.iterate = function()
    {

	// move em around
	for( i in this.flock)
	{
	    var bird = this.flock[i];
	    bird.applyForces();
	}
	for( i in this.flock)
	{
	    var bird = this.flock[i];
	    bird.move();
	}
    }

   
    this.isMoveGood = function( aChik)
    {

	//var _displayRatio = 1;
	//boundry image
	if( this._usingBoundry)
	{
	    var lox = (aChik.pos.x + aChik.pos.vx * aChik.speed)  ;
	    var loy = (aChik.pos.y + aChik.pos.vy * aChik.speed)  ;	    
	    if( this.patch.whatsAt(lox,loy) == 0 ){
		return false;
	    }
	}

	//walls
	if( aChik.pos.x + aChik.pos.vx * aChik.speed < 0 ) {
	    return false;
	}
	else if( aChik.pos.x + aChik.pos.vx * aChik.speed > 1 ) {
	    return false;
	}
	if( aChik.pos.y + aChik.pos.vy * aChik.speed < 0 ) {
	    return false;
	}
	else if( aChik.pos.y + aChik.pos.vy * aChik.speed > 1 ) {
	    return false;
	}

	return true 
    }
    
    this.attachBoundry  = function( patchIn )
    {
	this.patch = patchIn;
	this._usingBoundry = true;
    }
}



function drawEm( simu)
{
    //simu._sim_log = "drawer called";
    if( ! simu.simContext){
	//simu._sim_log = "0rawer called, no simContext specified";
	return;
    }

    var X = simu.simContext;
    var Wid = X.canvas.width;
    var Hei = X.canvas.height;
    //clear screen
   // X.fillStyle = "rgba(0,0,0,0.8)";
    //X.fillRect( 0,0, Wid, Hei);
    //X.fill();  
    X.clearRect( 0,0, Wid, Hei);
    
    //bird color
    X.fillStyle = 'red';
    
    for( i in simu.flock)
    {
	var bird = simu.flock[i];
	var bx = bird.pos.x;
	var by =  bird.pos.y;
	//draw bird
	X.beginPath();
	X.moveTo(bx*Wid, by * Hei);
	X.arc(bx*Wid,by*Hei, 4 , 0 , __twopi, true);
	X.fill();
	
	X.strokeStyle = "green";
	X.moveTo( bx * Wid + bird.r_attract * Wid, by*Hei); 
	X.arc(bx*Wid, by*Hei, bird.r_attract * Wid , 0 , __twopi, true);
	X.stroke();
	X.closePath()
	X.beginPath();
	X.strokeStyle = "tan";
	X.moveTo( bx * Wid + bird.r_repel * Wid, by*Hei); 
	X.arc(bx*Wid, by*Hei, bird.r_repel * Wid , 0 , __twopi, true);
	
	X.stroke();
	X.closePath();
    }
    
    for( i in simu.attractors)
    {
        var atr = simu.attractors[i];
        X.beginPath();
        if(atr.force > 0 )
	    X.fillStyle = "rgba(255, 0, 0, 0.1)";// put black rectangle down
        else
	    X.fillStyle = "rgba(0,0,255, 0.1)";// put black rectangle down
	
        X.strokeStyle = "red";
        X.moveTo( atr.pos.x * Wid + atr.radius * Wid, atr.pos.y*Hei); 
        X.arc(atr.pos.x*Wid,atr.pos.y*Hei, atr.radius * Wid , 0 , __twopi, true);
        X.stroke();
        X.fill();
        X.closePath();
    }
    
}

  