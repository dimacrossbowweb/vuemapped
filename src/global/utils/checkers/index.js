export function isClient () {

	return typeof window !== 'undefined' && typeof document !== 'undefined';

}

export function isServer () {

	return process !== undefined && !!process?.versions && !!process?.versions?.node;

}
