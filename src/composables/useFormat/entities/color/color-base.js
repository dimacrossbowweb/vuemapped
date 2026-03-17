import { Type } from '../type';

export class ColorBase extends Type {

	format = 'hex';

	constructor( format ) {

		super( 'color' );

		try {

			if ( typeof format !== 'string' ) {

				throw new Error( 'ColorBase -> constructor :: invalid format' );

			}

			this.format = format;

		} catch ( e ) {

			console.error( e );

		}

	}

	contrast() {

		return this;

	}

	static validate( value ) {

		return !!value;

	}

	static parse( value ) { return value }

}
