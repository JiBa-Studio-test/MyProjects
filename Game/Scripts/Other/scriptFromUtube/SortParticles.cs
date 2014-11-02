using UnityEngine;
using System.Collections;

public class SortParticles : MonoBehaviour 
{
	public string layerName = "particles";
	public void Start()
	{
		particleSystem.renderer.sortingLayerName = layerName;
	}
}
