/*!  TODO now not really solveBlackBoardProblem, should refer to:
https://forum.cocos.org/t/topic/96087
https://www.cgjoy.com/thread-107427-1-1.html
https://blog.csdn.net/u010302327/article/details/103006590
*/
export let solveBlackBoardProblem = (material, alphaTest=0.5) => {
	material.alphaTest = alphaTest

	return material
}