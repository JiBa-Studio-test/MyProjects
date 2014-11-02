var isDead:boolean=false;
var force:int;
var move:Move;
var playerAttribute:playerAttribute;
function Awake()
{
	move=GetComponent("Move");
}
function Start()
{
	playerAttribute=GetComponent("playerAttribute");
}
function Kill()
{
	
	collider2D.enabled=false;
	rigidbody2D.AddForce(Vector3.up*force);
	move.CharacterControl=false;
	isDead=true;
}

function RespawnAt(spawnPoint:Transform)
{
	isDead=false;
	collider2D.enabled=true;
	move.CharacterControl=true;
	transform.position=spawnPoint.position;
}
function TakeDamage(damage:float)
{
	playerAttribute.health-=damage;
}