import { ColorBase } from './color-base';

export class ColorRgb extends ColorBase {

	r = 0;
	g = 0;
	b = 0;
	a = 1;

	constructor( r, g, b, a = 1 ) {

		super( 'rgb' );

		try {

			if ( typeof r !== 'number' || r < 0 || r > 255 ) {

				throw new Error( 'ColorRgb -> constructor :: invalid r.' );

			}

			if ( typeof g !== 'number' || g < 0 || g > 255 ) {

				throw new Error( 'ColorRgb -> constructor :: invalid g.' );

			}

			if ( typeof b !== 'number' || b < 0 || b > 255 ) {

				throw new Error( 'ColorRgb -> constructor :: invalid b.' );

			}

			this.r = r;
			this.g = g;
			this.b = b;

			if ( a ) { this.a = a }

		} catch ( e ) {

			console.error( e );

		}

	}

	contrast () { 

		const brightness = Math.sqrt(

			this.r * this.r * 0.299 +
			this.g * this.g * 0.587 +
			this.b * this.b * 0.114

		);

		if ( brightness > 128 ) {

			return new ColorRgb( 0, 0, 0, 1 );

		}

		return new ColorRgb( 255, 255, 255, 1 );

	}

	static validate( value ) {

		return /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(\d*(?:\.\d+)?)\s*)?\)$/.test( value );

	}

	static parse( value ) {

		let match = value.match( /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(\d*(?:\.\d+)?)\s*)?\)$/ );

		if ( match ) {

			let r = parseInt( match[ 1 ], 10 );
			let g = parseInt( match[ 2 ], 10 );
			let b = parseInt( match[ 3 ], 10 );
			let a = match[ 5 ] ? parseFloat( match[ 5 ] ) : 1;

			return new ColorRgb( r, g, b, a );

		}

		return null;

	}

	toString() {

		return this.a === undefined ? `rgb(${ this.r }, ${ this.g }, ${ this.b })` : `rgba(${ this.r }, ${ this.g }, ${ this.b }, ${ this.a })`;

	}

}
