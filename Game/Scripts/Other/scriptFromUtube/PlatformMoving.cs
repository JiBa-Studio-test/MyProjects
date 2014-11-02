using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class PlatformMoving : MonoBehaviour 
{
	public enum FollowType
	{
		MoveTowards,
		Lerp
	}
	public FollowType Type = FollowType.MoveTowards;
	public MovingPlatformDef def;
	public float speed = 1;
	public float MaxDistanceToGoal = 0.1f;

	private IEnumerator <Transform> currentPoint;
	public void Start()
	{
		if (def == null) 
		{
			Debug.LogError ("Path Cannot be null", gameObject);
			return;
		}
		currentPoint = def.GetPathEnumerator ();
		currentPoint.MoveNext ();
		if (currentPoint.Current == null) 
		{
			return;
		}
		transform.position = currentPoint.Current.position;
	}

	public void Update()
	{
		if (currentPoint == null || currentPoint.Current == null)
			return;
		if (Type == FollowType.MoveTowards) 
			transform.position = Vector3.MoveTowards (transform.position, currentPoint.Current.position, Time.deltaTime*speed);
		else if (Type == FollowType.Lerp)
			transform.position = Vector3.Lerp (transform.position, currentPoint.Current.position,Time.deltaTime*speed);
		var distanceSquared = (transform.position - currentPoint.Current.position).sqrMagnitude;
		if (distanceSquared < MaxDistanceToGoal * MaxDistanceToGoal)
			currentPoint.MoveNext ();
	}
}

