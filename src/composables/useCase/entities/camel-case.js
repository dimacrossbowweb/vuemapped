export class CamelCase {

	static validate ( str ) {

		return /^[a-z]+([A-Z][a-z]+)*$/.test( str );

	}

	static parse ( value ) {

		return value
				.split( /(?=[A-Z])/ )
				.map( word => word.toLowerCase() );

	}

	static toString ( words ) {

		return words
				.map( ( word, i ) => {

					if ( i === 0 ) return word.toLowerCase();
					
					return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

				} )
				.join( '_' );

	}

};
