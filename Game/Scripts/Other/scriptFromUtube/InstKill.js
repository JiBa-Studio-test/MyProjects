function OnTriggerEnter2D(other:Collider2D)
{
	var player=other.GetComponent("Player");
	if(player==null)
	return;
	if(player.isDead==false)
	{
		levelManagement.instance.KillPlayer();
	}
}