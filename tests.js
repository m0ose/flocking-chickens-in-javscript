_testlog = "";
var ch;
runTests()
function runTests()
{

    var v = new vec(1,2,3,4);
    if( v.x == 1 && v.y == 2 && v.vx == 3 && v.vy == 4)
    {
	_testlog += " 1 passed \n";
    }
    else
    {
	_testlog += " 1 passed \n";
	alert("test1 failed");
    }

    v = new vec(1,2,3,4);
    v = v.normalize();
    if( v.vx == 3/5 && v.vy ==4/5 )
    {
	_testlog += " 2 passed \n";
    }
    else
    {
	_testlog += " 2 failed \n";
	alert("test 2 failed");
    }
    
    v = new vec(1,2,3,4);
    v.normalize();
    if( v.vx == 3/5 && v.vy ==4/5 )
    {
	_testlog += " 2.2 passed \n";
    }
    else
    {
	_testlog += " 2.2 failed \n";
	alert("test 2.2 failed");
    }
    
    ch = new chicken(1,1,1,1,1);

    ch.pos = v.clone();
    ch.pos.x = 0.8;
    ch.pos.y = 0.5;
    ch.pos.vx = -0.1;
    ch.pos.vy = -0.2;
    ch.move();
    if( ch.pos.x == 0.8 + ch.pos.vx && ch.pos.y == 0.5 + ch.pos.vy )
    {
	_testlog += " 3 passed \n";
    }
    else
    {
	_testlog += " 3 failed \n";
	alert("test 3 failed" + ch);
    }
    
    var ch1 = new chicken(1,1,1,1,1);
    var ch2 = new chicken(0,0,1,1,1);
    var dist = distance(ch1, ch2);
    if( dist == Math.sqrt(2) )
    {
	_testlog += " 4 passed \n";
    }
    else
    {
	_testlog += " 4 failed \n";
	alert("test 4 failed" + ch);
    }  
    
    dist = distance( ch2.pos, ch1.pos);
 if( dist == Math.sqrt(2) )
    {
	_testlog += " 5 passed \n" +dist + "\n";
    }
    else
    {
	_testlog += " 5 failed " + dist + "\n";
	alert("test 5 failed" + dist);
    } 

    var ch3 = new chicken(0.5,0.5,1,1,0.01);
    var ch4 = new chicken(0.5,0.5,1,1,0.01);
    ch = new chicken(0.4,0.5,1,1,0.01);
 
    flock.push(ch3);
    flock.push(ch4);
    flock.push(ch);
   _testlog += " new chickens \n ";
    for( i in flock)
    {
	var fl = flock[i];
	_testlog += fl.pos.toString2() + '\n';
    }
    ch3.applyForces();
    ch3.move();
    ch4.applyForces();
    ch4.move();
    ch.applyForces();
    ch.move();
    _testlog += " chickens moved \n ";
    for( i in flock)
    {
	var fl = flock[i];
	_testlog += fl.pos.toString2() + '\n';
    }
    
    window.onload = testSim;
}
var X;
var Wid;
var Hei;

function testSim()
{
    var Z = document.getElementById("_canvas");
    Wid = Z.width = Hei = Z.height = 600;//window.innerHeight -24;
    X = Z.getContext("2d");
    var flock_size = 20;
    flock = [];
//populate flock
    for( var i = 0 ; i < flock_size; i++)
    {
	flock.push( new chicken( Math.random(), Math.random(), 0.04 + Math.random() * 0.04, 0.04, 0.002 + Math.random() * 0.004) );
    }
// add one attractor
    var attract = new attractor( 0.5,0.5,0.04,0.3);
    var attract2 = new attractor(2,2,0.01,2.3);
    attractors.push( attract);
    attractors.push( attract2);
    attractors.push( new attractor( 0.5,0.5, -0.04,0.2) );


//start simulation
    setInterval ( "iterate()" , 20);

}
function iterate()
{
    //clear screen
    X.fillStyle = "rgba(0, 0, 0, 0.9)";// put black rectangle down
    X.fillRect( 0,0, Wid, Hei);
    X.beginPath();
    X.strokeStyle = "blue";
    X.fillStyle = "red";

// move em around
    for( i in flock)
	{
    X.beginPath();

	    var bird = flock[i];
	    bird.applyForces();
	    bird.move();
	    //draw bird
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