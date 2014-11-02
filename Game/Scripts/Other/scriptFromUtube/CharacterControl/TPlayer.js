var isFacingRight: boolean;
var controller: TCharacterController2D;
var normalizedHorizontalSpeed: float;
var maxSpeed: float=20;
var speedAcceralerationOnGround:float=10.0;
var speedAcceralerationInAir:float=5.0;

function Start()
{
	controller=GetComponent("TCharacterController2D");
	isFacingRight=transform.localScale.x>0;
}

function Update()
{
	HandleInput();
	var movementFactor:float;
	if(controller.state.isGrounded)
	{
		movementFactor=speedAcceralerationOnGround;
	}
	else
	{
		movementFactor=speedAcceralerationInAir;
	}
	controller.SetHorizontalForce(Mathf.Lerp(controller.velocity.x,normalizedHorizontalSpeed*maxSpeed,Time.deltaTime*movementFactor));
}

function HandleInput()
{
	if(Input.GetKey(KeyCode.D)||Input.GetKey(KeyCode.RightArrow))
	{
		normalizedHorizontalSpeed=1;
		if(!isFacingRight)
		{
			Flip();
		}
	}
	else if(Input.GetKey(KeyCode.A)||Input.GetKey(KeyCode.LeftArrow))
	{
		normalizedHorizontalSpeed=-1;
		if(isFacingRight)
		{
			Flip();
		}
	}
	else
	{
		normalizedHorizontalSpeed=0;
	}
	if(controller.CanJump()&&Input.GetKey(KeyCode.Space))
	{
		controller.Jump();
	}
}
function Flip()
{
	transform.localScale=Vector3(-transform.localScale.x,transform.localScale.y,transform.localScale.z);
	isFacingRight=transform.localScale.x>0;
}
