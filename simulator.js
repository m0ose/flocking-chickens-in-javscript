
/*
 the guts of the simulation
   cody smith

   run it using startSim();


*/
var X;
var Wid;
var Hei;
var _sim_log = "";
var __iter_interval;
var __draw_interval;
function startSim()
{
    init();
    __iter_interval = setInterval ( 'iterate()' , 2);
    __draw_interval = setInterval( 'drawEm()', 40);
}
function stopSim()
{
    if( __iter_interval)
	clearInterval( __iter_interval);
    if( __draw_interval)
	clearInterval( __draw_interval);
}
function init()
{
    var Z = document.getElementById("_bird_canvas");
    Wid = Z.width = Hei = Z.height = 600;//window.innerHeight -24;
    X = Z.getContext("2d");
    var flock_size = 60;
    flock = [];
//populate flock
    for( var i = 0 ; i < flock_size; i++)
    {
	try // some times patches is not defined
	{
	    if( patches && patches.patches)
	    {
		var x = Math.random();
		var y = Math.random();
		while( !patches.isInBounds(x,y) )
		{
		    x += 1/41;
		    y += 1/71;
		    x = x % 1;
		    y = y % 1;
		}
		flock.push( new chicken(x,y, 0.04 + Math.random() * 0.04, 0.04, 0.002 + Math.random() * 0.001) );
	    }
	}
	catch(e)
	{  
	    flock.push( new chicken( Math.random(), Math.random(), 0.04 + Math.random() * 0.04, 0.04, 0.002 + Math.random() * 0.001) );
	}
    }
// add one attractor
    var attract = new attractor( 0.5,0.5,0.04,0.1);
    var attract2 = new attractor(2,2,0.05,2.3);
    attractors.push( attract);
    attractors.push( attract2);
    attractors.push( new attractor( 0.5,0.5, -0.04,0.05) );

 


}
function iterate()
{

// move em around
    for( i in flock)
	{
	    var bird = flock[i];
	    bird.applyForces();
	    bird.move();
	}
}

function drawEm()
{
    //clear screen
    X.fillStyle = "rgba(0,0,0,0.8)";
    X.fillRect( 0,0, Wid, Hei);
    X.fill();  
//
//  draw boundry image if one exists
    try{
	X.putImageData( imagedata_polygon,0,0);
    }
    catch(e){ }

    //bird color
    X.fillStyle = 'red';
    
    for( i in flock)
    {
	    var bird = flock[i];
	   
	    //draw bird
	    X.beginPath();
	    X.moveTo( bird.pos.x*Wid, bird.pos.y * Hei);
	    X.arc(bird.pos.x*Wid,bird.pos.y*Hei, 9 , 0 , __twopi, true);
	    X.fill();

	    X.strokeStyle = "green";
	    X.moveTo( bird.pos.x * Wid + bird.r_attract * Wid, bird.pos.y*Hei); 
	    X.arc(bird.pos.x*Wid,bird.pos.y*Hei, bird.r_attract * Wid , 0 , __twopi, true);
	    X.stroke();
	    X.closePath()
	    X.beginPath();
	    X.strokeStyle = "tan";
	    X.moveTo( bird.pos.x * Wid + bird.r_repel * Wid, bird.pos.y*Hei); 
	    X.arc(bird.pos.x*Wid,bird.pos.y*Hei, bird.r_repel * Wid , 0 , __twopi, true);

	    X.stroke();
	    X.closePath();
	}
    
    for( i in attractors)
    {
        var atr = attractors[i];
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

