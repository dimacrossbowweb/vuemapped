import { ColorRgb } from './color-rgb';
import { colorByName } from '../../../../global/utils';

export class ColorRegister extends ColorRgb {

	constructor( r = 0, g = 0, b = 0, a = 0 ) {

		super( r, g, b, a );

	}

	static validate( value ) {

		return !!colorByName( value );

	}

	static parse( value ) {

		const color = colorByName( value );

		return color ? ColorRgb.parse( color ) : null;

	}

}
