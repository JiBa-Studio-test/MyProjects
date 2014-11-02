enum JumpBehavior
{
	CanJumpOnGround,
	CanJumpAnywhere,
	CanJump
}
var maxVelocity:Vector2=Vector2(float.MaxValue,float.MaxValue);
@RangeAttribute(0,90)
var slopeLimit:float=30;
var gravity:float=-25;
var jumpRestrictions:JumpBehavior;
var jumpFrequency:float=0.25;
var jumpMagnitude:float=12;
var typeOne:JumpBehavior=JumpBehavior.CanJumpOnGround;
var typeTwo:JumpBehavior=JumpBehavior.CanJumpAnywhere;