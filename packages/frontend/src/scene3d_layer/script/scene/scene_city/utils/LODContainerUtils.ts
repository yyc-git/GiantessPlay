export let buildStatus = (
	isCollisionable = true,
	isPickable = true,
	isVisible = true
) => {
	return {
		isCollisionable,
		isPickable,
		isVisible
	}
}