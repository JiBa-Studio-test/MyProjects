var index:int;
var arrival:boolean=false;
function SpawnPlayer(player:Player)
{
	player.RespawnAt(transform);
}
function OnTriggerEnter2D(other:Collider2D)
{
	if(other.tag=="Sword")
	{
	 arrival=true;
	 levelManagement.instance.setIndex(index);
	}
}