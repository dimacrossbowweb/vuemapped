import { ColorBase } from './color-base';

const TColorKeywordTypes = [

	'auto', 'transparent', 'currentColor'

];

export class ColorKeyword extends ColorBase {

	value = 'black';

	constructor( value = 'auto' ) {

		super( 'keyword-color' );

		this.value = value;

	}

	static validate( value ) {

		return TColorKeywordTypes.includes( value.trim().toLowerCase() );

	}

	static parse( value ) {

		if ( TColorKeywordTypes.includes( value.trim().toLowerCase() ) ) {

			return new ColorKeyword( value );

		}

		return null;

	}

	toString() {

		return this.value;

	}

}
