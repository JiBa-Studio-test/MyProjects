enum FollowType
	{
		MoveTowards,
		Lerp
	}
var def:PlatformDefJava;
var speed:float = 1;
var MaxDistanceToGoal: float= 0.1f;
var direction:int= 1;
var index:int = 0;
var Type:FollowType = FollowType.MoveTowards;
function Start()
{
	if (def == null) 
		{
			Debug.LogError ("Path Cannot be null", gameObject);
			return;
		}
		if (def.points[0] == null) 
		{
			return;
		}
		transform.position = def.points[0].position;
}
function Update()
{
	if (def.points == null || def.points[index] == null)
			return;
		if (Type == FollowType.MoveTowards) 
			transform.position = Vector3.MoveTowards (transform.position, def.points[index].position, Time.deltaTime*speed);
		else if (Type == FollowType.Lerp)
			transform.position = Vector3.Lerp (transform.position, def.points[index].position,Time.deltaTime*speed);
		var distanceSquared = (transform.position - def.points[index].position).sqrMagnitude;
		if (distanceSquared < MaxDistanceToGoal * MaxDistanceToGoal)
		{
			if(index<=0)
			{
				direction=1;
			}
			else if(index>=(def.points.Length-1))
			{
				direction=-1;
			}
			index=index+direction;
		}
}
