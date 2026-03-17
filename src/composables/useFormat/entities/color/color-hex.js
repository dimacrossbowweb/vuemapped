import { ColorBase } from './color-base';

export class ColorHex extends ColorBase {

	r = 0;
	g = 0;
	b = 0;
	a = 1;

	constructor( r, g, b, a = 1 ) {

		super( 'hex' );

		try {

			if ( typeof r !== 'number' || r < 0 || r > 255 ) {

				throw new Error( 'ColorHex -> constructor :: invalid r.' );

			}

			if ( typeof g !== 'number' || g < 0 || g > 255 ) {

				throw new Error( 'ColorHex -> constructor :: invalid g.' );

			}

			if ( typeof b !== 'number' || b < 0 || b > 255 ) {

				throw new Error( 'ColorHex -> constructor :: invalid b.' );

			}

			this.r = r;
			this.g = g;
			this.b = b;

			if ( a ) { this.a = a }

		} catch ( e ) {

			console.error( e );

		}

	}

	contrast() {

		const brightness = Math.sqrt(

			this.r * this.r * 0.299 +
			this.g * this.g * 0.587 +
			this.b * this.b * 0.114

		);

		if ( brightness > 128 ) {

			return new ColorHex( 0, 0, 0, 1 );

		}

		return new ColorHex( 255, 255, 255, 1 );

	}

	static validate( value ) {

		return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test( value );

	}

	static parse( value ) {

		let match = value.match( /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/ );

		if ( match ) {

			let hex = value.replace( '#', '' );
			let a = 255;

			if ( hex.length === 3 ) {

				hex = hex.split( '' ).map( x => x + x ).join( '' );

			} else if ( hex.length === 4 ) {

				hex = hex.split( '' ).map( x => x + x ).join( '' );
				a = parseFloat( ( parseInt( hex.slice( 6, 8 ), 16 ) / 255 ).toFixed( 1 ) );

			} else if ( hex.length === 8 ) {

				a = parseFloat( ( parseInt( hex.slice( 6, 8 ), 16 ) / 255 ).toFixed( 1 ) );

			}

			let bigint = parseInt( hex.slice( 0, 6 ), 16 );
			let r = ( bigint >> 16 ) & 255;
			let g = ( bigint >> 8 ) & 255;
			let b = bigint & 255;

			return new ColorHex( r, g, b, a );

		}

		return null;

	}

	toString() {

		return this.a === undefined ? `rgb(${ this.r }, ${ this.g }, ${ this.b })` : `rgba(${ this.r }, ${ this.g }, ${ this.b }, ${ this.a })`;

	}

}
