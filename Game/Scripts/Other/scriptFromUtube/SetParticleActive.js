var option:boolean;
var game:GameObject;
function Start()
{
option=false;
game=GameObject.Find("Particle");

}
function Update()
{
game.SetActive(option);
}