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

export let getTuple3Second = ([x, y, z]) => {
	return y
}

export let getTuple3Last = ([x, y, z]) => {
	return z
}

export let getTuple4First = ([x, y, z, w]) => {
	return x
}

export let getTuple4Last = ([x, y, z, w]) => {
	return w
}

export let isTuple2Equal = (a, b) => {
	return a[0] == b[0] && a[1] == b[1]
}