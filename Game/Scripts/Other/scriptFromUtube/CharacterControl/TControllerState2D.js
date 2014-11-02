var isCollidingRight:boolean;
var isCollidingLeft:boolean;
var isCollidingAbove:boolean;
var isCollidingBelow:boolean;
var isMovingDownSlope:boolean;
var isMovingUpSlope:boolean;
var slopeAngle:float;
var isGrounded:boolean;
var hasCollisions:boolean;
function Update()
{
	isGrounded=isCollidingBelow;
	hasCollisions=isCollidingRight||isCollidingLeft||isCollidingAbove||isCollidingBelow;
}
function Reset()
{
	isCollidingRight=false;
	isCollidingLeft=false;
	isCollidingAbove=false;
	isCollidingBelow=false;
	isMovingDownSlope=false;
	isMovingUpSlope=false;
	slopeAngle=0;
}
function PrintOut()
{
	print("r="+isCollidingRight+"l="+isCollidingLeft+
			"a="+isCollidingAbove+"b="+isCollidingBelow
			+"down-slope="+isMovingDownSlope+"up-slope="+isMovingUpSlope
			+"angle="+slopeAngle);
}