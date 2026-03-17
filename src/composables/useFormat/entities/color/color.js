import { ColorBase } from './color-base';
import { ColorRgb } from './color-rgb';
import { ColorHex } from './color-hex';
import { ColorHsl } from './color-hsl';
import { ColorRegister } from './color-register';
import { ColorKeyword } from './color-keyword';

export class Color extends ColorBase {

	constructor( format ) {

		super( 'color' );

		try {

			if ( typeof format !== 'string' ) {

				throw new Error( 'Color -> constructor :: invalid format' );

			}

			this.format = format;

		} catch ( e ) {

			console.error( e );

		}

	}

	static validate( value ) {

		return ColorRegister.validate( value ) ||
			   ColorRgb.validate( value ) ||
			   ColorHex.validate( value ) ||
			   ColorHsl.validate( value );

	}

	static parse( value ) {

		if ( typeof value !== 'string' ) { return null }

		if ( ColorKeyword.validate( value ) ) {

			return ColorKeyword.parse( value );

		}

		if ( ColorRegister.validate( value ) ) {

			return ColorRegister.parse( value );

		}

		if ( ColorRgb.validate( value ) ) {

			return ColorRgb.parse( value );

		}

		if ( ColorHex.validate( value ) ) {

			return ColorHex.parse( value );

		}

		if ( ColorHsl.validate( value ) ) {

			return ColorHsl.parse( value );

		}

		return null;

	}

	static convert( color, model = 'hex' ) {

		// KeyWord colors (transparent, currentColor…) have no numeric channels
		if ( color instanceof ColorKeyword ) return null;

		// ── Step 1: normalise input to r, g, b (0-255) + a (0-1) ──────────────

		let r, g, b, a;

		if ( color instanceof ColorHsl ) {

			const h = color.h;
			const s = color.s;
			const l = color.l;

			a = color.a ?? 1;

			const c  = ( 1 - Math.abs( 2 * l - 1 ) ) * s;
			const x  = c * ( 1 - Math.abs( ( h / 60 ) % 2 - 1 ) );
			const m  = l - c / 2;

			let r1, g1, b1;

			if      ( h < 60  ) { r1 = c; g1 = x; b1 = 0; }
			else if ( h < 120 ) { r1 = x; g1 = c; b1 = 0; }
			else if ( h < 180 ) { r1 = 0; g1 = c; b1 = x; }
			else if ( h < 240 ) { r1 = 0; g1 = x; b1 = c; }
			else if ( h < 300 ) { r1 = x; g1 = 0; b1 = c; }
			else                { r1 = c; g1 = 0; b1 = x; }

			r = Math.round( ( r1 + m ) * 255 );
			g = Math.round( ( g1 + m ) * 255 );
			b = Math.round( ( b1 + m ) * 255 );

		} else {

			// ColorRgb / ColorHex / ColorRegister — all carry r, g, b, a
			r = color.r ?? 0;
			g = color.g ?? 0;
			b = color.b ?? 0;
			a = color.a ?? 1;

		}

		// ── Step 2: produce the requested model ───────────────────────────────

		if ( model === 'rgb' ) {

			return new ColorRgb( r, g, b, a );

		}

		if ( model === 'hex' ) {

			return new ColorHex( r, g, b, a );

		}

		if ( model === 'hsl' ) {

			const r1 = r / 255;
			const g1 = g / 255;
			const b1 = b / 255;

			const max = Math.max( r1, g1, b1 );
			const min = Math.min( r1, g1, b1 );
			const d   = max - min;

			const l = ( max + min ) / 2;

			let h, s;

			if ( d === 0 ) {

				h = 0;
				s = 0;

			} else {

				s = d / ( 1 - Math.abs( 2 * l - 1 ) );

				if      ( max === r1 ) { h = 60 * ( ( ( g1 - b1 ) / d ) % 6 ); }
				else if ( max === g1 ) { h = 60 * ( ( b1 - r1 ) / d + 2 ); }
				else                   { h = 60 * ( ( r1 - g1 ) / d + 4 ); }

				h = ( h + 360 ) % 360;

			}

			return new ColorHsl( Math.round( h ), s, l, a );

		}

		return null;

	}

}
