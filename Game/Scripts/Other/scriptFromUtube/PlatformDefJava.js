var points: Transform[];
var length:int;
var index:int;
function OnDrawGizmos()
{
	if (points == null || points.Length < 2) 
	{
		return;
	}
	for(var i=1;i<points.Length;i++)
	{
		Gizmos.DrawLine(points[i-1].position,points[i].position);
	}
}
