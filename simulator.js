var X;
var Wid;
var Hei;

function testSim()
{
    init();
    setInterval ( 'iterate()' , 20);
    setInterval( 'drawEm()', 40);
}
function init()
{
    var Z = document.getElementById("_canvas");
    Wid = Z.width = Hei = Z.height = 600;//window.innerHeight -24;
    X = Z.getContext("2d");
    var flock_size = 50;
    flock = [];
//populate flock
    for( var i = 0 ; i < flock_size; i++)
    {
	flock.push( new chicken( Math.random(), Math.random(), 0.04 + Math.random() * 0.04, 0.04, 0.002 + Math.random() * 0.001) );
    }
// add one attractor
    var attract = new attractor( 0.5,0.5,0.04,0.3);
    var attract2 = new attractor(2,2,0.01,2.3);
    attractors.push( attract);
    attractors.push( attract2);
    attractors.push( new attractor( 0.5,0.5, -0.04,0.2) );




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

    //bird color
    X.fillStyle = 'red';
    for( i in flock)
    {
	    var bird = flock[i];
	   
	    //draw bird
	    X.beginPath();
	    X.moveTo( bird.pos.x*Wid, bird.pos.y * Hei);
	    X.arc(bird.pos.x*Wid,bird.pos.y*Hei, 9 , 0 , 6.3, true);
	    X.fill();

	    X.strokeStyle = "green";
	    X.moveTo( bird.pos.x * Wid + bird.r_attract * Wid, bird.pos.y*Hei); 
	    X.arc(bird.pos.x*Wid,bird.pos.y*Hei, bird.r_attract * Wid , 0 , 6.3, true);
	    X.stroke();
	    X.closePath()
	    X.beginPath();
	    X.strokeStyle = "tan";
	    X.moveTo( bird.pos.x * Wid + bird.r_repel * Wid, bird.pos.y*Hei); 
	    X.arc(bird.pos.x*Wid,bird.pos.y*Hei, bird.r_repel * Wid , 0 , 6.3, true);

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