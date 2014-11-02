
var Velocity:Vector2;
var lastPosition:Vector2;

var move:Move;
function Update()
{
	Velocity=(lastPosition-transform.position)/Time.deltaTime;
	lastPosition=transform.position;
}

function setForce(vector:Vector2,power:float)
{
	rigidbody2D.AddForce(vector*power);
}
function Dumb(dumbTime:float)
{
	move=GetComponent("Move");
	move.CharacterControl=false;
	Wait(dumbTime);
}
function Wait(dumbTime:float)
{
	yield WaitForSeconds(dumbTime);
	move.CharacterControl=true;
}
