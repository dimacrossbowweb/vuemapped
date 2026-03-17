import { ColorBase } from './color-base';

export class ColorHsl extends ColorBase {

	h = 0;
	s = 0;
	l = 0;
	a = 1;

	constructor( h, s, l, a = 1 ) {

		super( 'hsl' );

		try {

			if ( typeof h !== 'number' || h < 0 || h > 360 ) {

				throw new Error( 'ColorHsl -> constructor :: invalid h.' );

			}

			if ( typeof s !== 'number' || s < 0 || s > 1 ) {

				throw new Error( 'ColorHsl -> constructor :: invalid s.' );

			}

			if ( typeof l !== 'number' || l < 0 || l > 1 ) {

				throw new Error( 'ColorHsl -> constructor :: invalid l.' );

			}

			this.h = h;
			this.s = s;
			this.l = l;

			if ( a ) { this.a = a }

		} catch ( e ) {

			console.error( e );

		}

	}

	static validate( value ) {

		return /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(,\s*(\d*(?:\.\d+)?)\s*)?\)$/.test( value );

	}

	static parse( value ) {

		let match = value.match( /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(,\s*(\d*(?:\.\d+)?)\s*)?\)$/ );

		if ( match ) {

			let h = parseInt( match[ 1 ], 10 );
			let s = parseInt( match[ 2 ], 10 );
			let l = parseInt( match[ 3 ], 10 );
			let a = match[ 5 ] ? parseFloat( match[ 5 ] ) : 1;

			return new ColorHsl( h, s, l, a );

		}

		return null;

	}

	toString() {

		return this.a === undefined ? `rgb(${ this.h }, ${ this.s }, ${ this.l })` : `rgba(${ this.h }, ${ this.s }, ${ this.l }, ${ this.a })`;

	}

}
