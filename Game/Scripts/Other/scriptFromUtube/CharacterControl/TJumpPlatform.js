var jumpMagnitude=3000;
function ControllerEnter2D(controller:TCharacterController2D)
{
	controller.SetVerticalForce(jumpMagnitude);
	controller.state.isCollidingBelow=false;
}