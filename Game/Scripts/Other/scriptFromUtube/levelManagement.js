static var instance:levelManagement;
var player:Player;
var cameraController:CameraControl;
var checkpoints:checkPoint[];
var _currentPointIndex: int;
function Awake()
{
instance=this;
}

function Start()
{
	checkpoints=FindObjectsOfType(checkPoint);
	if(checkpoints.length>0)
	{
		_currentPointIndex=0;
	}
	else
	{
		_currentPointIndex=-1;
	}
	player=FindObjectOfType(Player);
	cameraController=FindObjectOfType(CameraControl);
	Order();
	for(var i:int=0;i<checkpoints.length;i++)
	{
		checkpoints[i].index=i;
	}
	if(_currentPointIndex!=-1)
	{
		checkpoints[_currentPointIndex].SpawnPlayer(player);
	}
	
}
function Update()
{
	
}

function KillPlayer()
{
	KillPlayerCo();
} 
function setIndex(index:int)
{
 if(_currentPointIndex>index)
 {return;}
 _currentPointIndex=index;
 
}

function KillPlayerCo()
{
	player.Kill();
	cameraController.isFollowing=false;
	yield WaitForSeconds(1.5);
	if(_currentPointIndex!=-1)
	{
		checkpoints[_currentPointIndex].SpawnPlayer(player);
		cameraController.isFollowing=true;
	}
}
function Order()
{
	var count:int=checkpoints.length;
	var media:checkPoint;
	var swapped:boolean;
	do
	{	
		swapped=false;
		for(var i:int=0;i<count-1;i++)
		{
			if(checkpoints[i].transform.position.x>checkpoints[i+1].transform.position.x)
			{
				media=checkpoints[i];
				checkpoints[i]=checkpoints[i+1];
				checkpoints[i+1]=media;
				swapped=true;
			}
		}	
	}
	while(swapped);
}
