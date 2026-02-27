declare const Vue: typeof import('vue')

export function getVueValue<K extends keyof typeof Vue>(key: K): typeof Vue[K] {
	return Vue[key]
}
