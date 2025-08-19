// export let getTuple2First = ([x, y]) => {
export let getTuple2First = (value) => {
	return value[0]
}

export let getTuple2Last = ([x, y]) => {
	return y
}

export let getTuple3First = ([x, y, z]) => {
	return x
}

export let isTuple2Equal = (a, b) => {
	return a[0] == b[0] && a[1] == b[1]
}