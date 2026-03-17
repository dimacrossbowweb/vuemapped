import { Modificator } from './modificator';
import { useCase } from '../../useCase';

const { convert } = useCase();

export class Base {

	_name;

	modificators;

	mixins;

	constructor ( name ) {

		try {

			if ( typeof name !== 'string' || !name.trim() ) {

				throw new Error( 'useBem -> Base :: invalid class name. Expected not empty string' );

			}

			this._name = convert( name, 'kebab-case' );

			this.modificators = [];

			this.mixins = [];

		} catch ( e ) {

			console.error( e );

		}

	}

	m ( name, value = true ) {

		const modificatorIndex = this.modificators.findIndex( ( item ) => item.name === name );

		if ( modificatorIndex >= 0 ) {

			if ( value ) {

				this.modificators[ modificatorIndex ].value = value;

			} else {

				this.modificators.splice( modificatorIndex, 1 );

			}

		} else {

			name && value && this.modificators.push( new Modificator( name, value ) );

		}

		return this;

	}

	rm ( name ) {

		const modificatorIndex = this.modificators.findIndex( ( item ) => item.name === name );

		if ( modificatorIndex >= 0 ) {

			this.modificators.splice( modificatorIndex, 1 );

		}

		return this;

	}

	mix ( name ) {
	
		try {

			if ( typeof name !== 'string' && name !== undefined ) {

				throw new Error( 'useBem -> Base -> mix :: invalid name' );

			}

			if ( name === this._name ) {

				throw new Error( `useBem -> Base -> mix :: cannot create mixin with basis name "${ this._name }"` );

			}

			if ( !name ) return this;

			const isExist = this.mixins.find( ( item ) => item === name );

			if ( !isExist ) {

				this.mixins.push( name ); 

			}

		} catch ( e ) {

			console.error( e );

		}

		return this;

	}

	get name () {

		return this._name;

	}

	classify () {

		return [ this.name ]
				.concat(

					this.modificators.map( ( item ) => `${ this.name }_${ item.toString() }` ),
					this.mixins
					
				);

	}

	toString () {

		return this.classify().join( ' ' );

	}

}
