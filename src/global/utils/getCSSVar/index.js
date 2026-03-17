import { isClient } from '../checkers';

export function getCSSVar ( name, el = null ) {

	if ( isClient() ) {

		const element = el ? el : document.documentElement;

		return getComputedStyle( element ).getPropertyValue( `--${ name }` ).trim() || null;

	}

	return null;

}
