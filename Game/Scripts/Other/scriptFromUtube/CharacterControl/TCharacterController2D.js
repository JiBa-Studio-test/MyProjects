var skinWidth:float=0.02;
var totalHorizontalRays:int=8;
var totalVerticalRays:int=3;
var slopeLimiteTangent:float=Mathf.Tan(45*Mathf.Deg2Rad);
var platformMask: LayerMask;
var defaultParameters: TControllerParameters2D;
var parameters: TControllerParameters2D;
var state:TControllerState2D;
var velocity:Vector2;
var refDeltaMovement:Vector2;
var handleCollisions:boolean;
var raycastTopLeft:Vector3;
var raycastBottomLeft:Vector3;
var raycastBottomRight:Vector3;
var stepToGo:float;

var standingOn:GameObject;
var lastStandingOn:GameObject;

var jumpIn:float;
var activeGlobalPlatformPoint:Vector3;
var activeLocalPlatformPoint:Vector3;
var platformVelocity:Vector3;

var stepLock:boolean;

var _transform:Transform;
var _localScale:Vector3;
var boxCollider:BoxCollider2D;

var verticalDistanceBetweenRays:float;
var horizontalDistanceBetweenRays:float;

function Awake()
{
	state=GetComponent("TControllerState2D");
	_transform=transform;
	_localScale=transform.localScale;
	boxCollider=GetComponent("BoxCollider2D");
	handleCollisions=true;
	var colliderWidth=boxCollider.size.x*Mathf.Abs(transform.localScale.x)-2*skinWidth;
	horizontalDistanceBetweenRays=colliderWidth/(totalVerticalRays-1);
	parameters=GetComponent("TControllerParameters2D"); 
	var colliderHeight=boxCollider.size.y*Mathf.Abs(transform.localScale.y)-2*skinWidth;
	verticalDistanceBetweenRays=colliderHeight/(totalHorizontalRays-1);
	//platformMask=0;
	stepToGo=1;
	
	
}
function Start()
{
	
}
function AddForce(force:Vector2)
{
	velocity+=force;
}
function SetForce(force:Vector2)
{
	velocity=force;
}
function SetHorizontalForce(x:float)
{
	velocity.x=x;
}
function SetVerticalForce(y:float)
{
	velocity.y=y;
}
function Jump()
{
	AddForce(Vector2(0,parameters.jumpMagnitude));
	jumpIn=parameters.jumpFrequency;

}
function LateUpdate()
{
	jumpIn-=Time.deltaTime;
	Move(velocity*Time.deltaTime);
	SetGravity();
	
}
function Move(deltaMovement:Vector2)
{
	refDeltaMovement=deltaMovement;

	var wasGrounded:boolean=state.isCollidingBelow;
	state.Reset();
	if(handleCollisions)
	{
		HandlePlatforms();
		CalculateRayOrigins();
		
		if(refDeltaMovement.y<0&&wasGrounded)
		{
			
			HandleVerticalSlope(refDeltaMovement);
		}
		
		if(Mathf.Abs(refDeltaMovement.x)>0.001)
		{
		MoveHorizontally(refDeltaMovement);
		
		}
		
		MoveVertically(refDeltaMovement);
		
		CorrectPlatformHitting(refDeltaMovement,true);
		
		CorrectPlatformHitting(refDeltaMovement,false);
		
	}
	transform.Translate(refDeltaMovement,Space.World);
	
	if(stepLock)
	{
		if(Time.deltaTime>0)
		{
			velocity=refDeltaMovement/Time.deltaTime;
			velocity.x=Mathf.Min(velocity.x,parameters.maxVelocity.x);
			velocity.y=Mathf.Min(velocity.y,parameters.maxVelocity.y);
			
		}
	}
	stepLock=true;
	if(standingOn!=null)
	{
		activeGlobalPlatformPoint=transform.position;
		activeLocalPlatformPoint=standingOn.transform.InverseTransformPoint(transform.position);
		if(lastStandingOn!=standingOn)
		{
			if(lastStandingOn!=null)
			{
				lastStandingOn.SendMessage("ControllerExit2D",this,SendMessageOptions.DontRequireReceiver);
			}
			standingOn.SendMessage("ControllerEnter2D",this,SendMessageOptions.DontRequireReceiver);
			lastStandingOn=standingOn;
		}
		else if(standingOn!=null)
		{
			standingOn.SendMessage("ControllerStay2D",this,SendMessageOptions.DontRequireReceiver);
		}
		
		
	}
	else if(lastStandingOn!=null)
	{
		lastStandingOn.SendMessage("ControllerExit2D",this,SendMessageOptions.DontRequireReceiver);
		lastStandingOn=null; 
	}
	
}
function HandlePlatforms()
{
	if(standingOn!=null)
	{
		var newGlobalPlatformPoint:Vector3=standingOn.transform.TransformPoint(activeLocalPlatformPoint);
		var movingDistance:Vector3=newGlobalPlatformPoint-activeGlobalPlatformPoint;
		if(movingDistance!=Vector3.zero)
		{
			transform.Translate(movingDistance,Space.World);
		}
		
		platformVelocity=(newGlobalPlatformPoint-activeGlobalPlatformPoint)/Time.deltaTime;
	}
	else
	{
		platformVelocity=Vector3.zero;
	}
	standingOn=null;
}
function HandleSteps(deltaMovement:Vector2,hittingY:float,angle:float,isGoingRight:boolean,stair:GameObject):boolean
{
	if(angle!=90)
	{
		return false;
	}
	var boxColliderForStep:BoxCollider2D=stair.GetComponent("BoxCollider2D");	
	var size:Vector2=Vector2(boxColliderForStep.size.x*Mathf.Abs(stair.transform.localScale.x),boxColliderForStep.size.y*Mathf.Abs(stair.transform.localScale.y))/2;
	TopConnerY=stair.transform.position.y+size.y;
	deltaY=TopConnerY-hittingY;
	if(deltaY<stepToGo)
	{
		refDeltaMovement.y=deltaY+0.1;
		refDeltaMovement.x=deltaMovement.x;
		return true;	
	}
	else
	{
		return false;
	}
}
function CalculateRayOrigins()
{
	var size:Vector2=Vector2(boxCollider.size.x*Mathf.Abs(_localScale.x),boxCollider.size.y*Mathf.Abs(_localScale.y))/2;
	var center:Vector2=Vector2(boxCollider.center.x*_localScale.x,boxCollider.center.y*_localScale.y);
	raycastTopLeft=_transform.position+Vector3(center.x-size.x+skinWidth,center.y+size.y-skinWidth);
	raycastBottomLeft=_transform.position+Vector3(center.x-size.x+skinWidth,center.y-size.y+skinWidth);
	raycastBottomRight=_transform.position+Vector3(center.x+size.x-skinWidth,center.y-size.y+skinWidth);
}
function MoveHorizontally(deltaMovement:Vector2)//ref
{
	var isGoingRight:boolean=deltaMovement.x>0;
	var rayDistance:float=Mathf.Abs(deltaMovement.x)+skinWidth;
	var rayDirection:Vector2;
	if(isGoingRight)
	{
		rayDirection=Vector2.right;
	}
	else
	{
		rayDirection=-Vector2.right;
	}
	var rayOrigin:Vector2;
	if(isGoingRight)
	{
		rayOrigin=raycastBottomRight;
	}
	else
	{
		rayOrigin=raycastBottomLeft;
	}
	for(var i=0;i<totalHorizontalRays;i++)
	{
		var rayVector:Vector2=Vector2(rayOrigin.x,rayOrigin.y+i*verticalDistanceBetweenRays);
		Debug.DrawRay(rayVector,rayDistance*rayDirection,Color.red);
		var rayCastHit=Physics2D.Raycast(rayVector,rayDirection,rayDistance,platformMask);
		if(!rayCastHit)
		continue;
		var hittingSteps:GameObject=rayCastHit.collider.gameObject;
		if(i==0)
		{
			if(HandleSteps(deltaMovement,rayCastHit.point.y,Vector2.Angle(rayCastHit.normal,Vector2.up),isGoingRight,hittingSteps))
			{
				stepLock=false;
				print(stepLock);
				break;
			}
		}
		if(i==0&&HandleHorizontalSlope(deltaMovement,Vector2.Angle(rayCastHit.normal,Vector2.up),isGoingRight))
		{break;}
		deltaMovement.x=rayCastHit.point.x-rayVector.x;
		rayDistance=Mathf.Abs(deltaMovement.x);
		if(isGoingRight)
		{
			deltaMovement.x-=skinWidth;
			state.isCollidingRight=true;
		}
		else
		{
			deltaMovement.x+=skinWidth;
			state.isCollidingLeft=true;
		}
		refDeltaMovement=deltaMovement;
		if(rayDistance<skinWidth+0.0001)
		{break;}
	}
}
function MoveVertically(deltaMovement:Vector2)//ref
{
	var isGoingUp:boolean=deltaMovement.y>0;
	var rayDistance:float=Mathf.Abs(deltaMovement.y)+skinWidth;
	var rayDirection:Vector2;
	if(isGoingUp)
	{
		rayDirection=Vector2.up;
	}
	else
	{
		rayDirection=-Vector2.up;
	}
	var rayOrigin:Vector2;
	if(isGoingUp)
	{
		rayOrigin=raycastTopLeft;
	}
	else
	{
		rayOrigin=raycastBottomLeft;
	}
	rayOrigin.x+=deltaMovement.x;
	var standingOnDistance:float=float.MaxValue;
	for(var i=0;i<totalVerticalRays;i++)
	{
		var rayVector:Vector2=Vector2(rayOrigin.x+i*horizontalDistanceBetweenRays,rayOrigin.y);
		Debug.DrawRay(rayVector,rayDistance*rayDirection,Color.red);
		var rayCastHit=Physics2D.Raycast(rayVector,rayDirection,rayDistance,platformMask);
		if(!rayCastHit)
		continue;
		
		if(!isGoingUp)
		{
			var verticalDistanceToHit:float=_transform.position.y-rayCastHit.point.y;
			if(verticalDistanceToHit<standingOnDistance)
			{
				standingOnDistance=verticalDistanceToHit;
				standingOn=rayCastHit.collider.gameObject;
			}
		}
		
		deltaMovement.y=rayCastHit.point.y-rayVector.y;
		rayDistance=Mathf.Abs(deltaMovement.y);
		if(isGoingUp)
		{
			deltaMovement.y-=skinWidth;
			state.isCollidingAbove=true;
		}
		else
		{
			deltaMovement.y+=skinWidth;
			state.isCollidingBelow=true;
		}
		refDeltaMovement.y=deltaMovement.y;
		if(rayDistance<skinWidth+0.0001)
		{break;}
	}
		
}
function HandleVerticalSlope(deltaMovement:Vector2)//ref
{
	var center:float=(raycastBottomLeft.x+raycastBottomRight.x)/2;
	var direction:Vector2=-Vector2.up;
	var slopeDistance:float=slopeLimiteTangent*(raycastBottomRight.x-center);
	var slopeRayVector:Vector2=Vector2(center,raycastBottomLeft.y);
	Debug.DrawRay(slopeRayVector,direction*slopeDistance,Color.yellow);
	var raycastHit=Physics2D.Raycast(slopeRayVector,direction,slopeDistance,platformMask);
	if(!raycastHit)
	{
		return;
		
	}
	var isMovingDownSlope:boolean=(Mathf.Sign(raycastHit.normal.x)==Mathf.Sign(deltaMovement.x));
	if(!isMovingDownSlope)
	{
		return;
		
	}
	var angle=Vector2.Angle(raycastHit.normal,Vector2.up);
	if(Mathf.Abs(angle)<0.0001)
	{
		return;
		
	}
	state.isMovingDownSlope=true;
	state.slopeAngle=angle;
	deltaMovement.y=raycastHit.point.y-slopeRayVector.y;
	refDeltaMovement.y=deltaMovement.y;
}
function HandleHorizontalSlope(deltaMovement:Vector2,angle:float,isGoingRight:boolean):boolean//ref
{
	if(Mathf.RoundToInt(angle)==90)
	{
		return false;
	}
	if(angle>parameters.slopeLimit)
	{
		refDeltaMovement.x=0;
		return true;
	}
	if(deltaMovement.y>0.07)
	{
		return true;
	}
	if(isGoingRight)
	{
		refDeltaMovement.x=deltaMovement.x;
	}
	else
	{
		refDeltaMovement.x=deltaMovement.x;
	}
	refDeltaMovement.y=Mathf.Abs(Mathf.Tan(angle*Mathf.Deg2Rad)*refDeltaMovement.x);
	state.isMovingUpSlope=true;
	state.isCollidingBelow=true;
	return true;
}
function OntriggerEnter2D(other:Collider)
{}
function OnTrigerExit2D(other:Collider)
{}
function CanJump():boolean
{
	if(parameters.jumpRestrictions==parameters.typeTwo)
	{
		return (jumpIn<=0);
	}
	if(parameters.jumpRestrictions==parameters.typeOne)
	{
		return state.isGrounded;
	}
	else
	{
		return false;
	}
}
function CorrectPlatformHitting(deltaMovement:Vector2,isRight:boolean)
{
	var halfWidth:float=(boxCollider.size.x*_localScale.x)/2;
	var rayOrigin:Vector2;
	if(isRight)
	{
		rayOrigin=raycastBottomRight;
	}
	else	
	{
		rayOrigin=raycastBottomLeft;
	}
	if(isRight)
	{
		rayOrigin.x-=(halfWidth-skinWidth);
	}
	else	
	{
		rayOrigin.x+=(halfWidth-skinWidth);
	}
	var rayDirection:Vector2;
	if(isRight)
	{
		rayDirection=Vector2.right;
	}
	else	
	{
		rayDirection=-Vector2.right;
	}
	var offset:float=0.0;
	for(var i:int=1;i<totalHorizontalRays-1;i++)
	{
		var rayVector=new Vector2(rayOrigin.x+deltaMovement.x,rayOrigin.y+deltaMovement.y+i*verticalDistanceBetweenRays);
		Debug.DrawRay(rayVector,rayDirection*halfWidth,Color.cyan);
		var rayCastHit=Physics2D.Raycast(rayVector,rayDirection,halfWidth,platformMask);
		if(!rayCastHit)
		{
			continue;
		}
		if(isRight)
		{
			offset=rayCastHit.point.x-_transform.position.x-halfWidth;
		}
		else
		{
			offset=halfWidth-(_transform.position.x-rayCastHit.point.x);
		}
		refDeltaMovement.x=offset;
	}
}
function SetGravity()
{
	if(state.isCollidingBelow)
	{
		velocity.y=-1;
	}
	else
	{
		velocity.y+=parameters.gravity*Time.deltaTime;
	}
}
