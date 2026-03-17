export class PascalCase {

	static validate ( str ) {

		return /^[A-Z][a-zA-Z]+$/.test( str );

	}

	static parse ( value ) {

		return value
			.split(/(?=[A-Z])/)
			.map( ( word ) => word.toLowerCase() );

	}

	static toString ( words ) {

		return words
				.map( ( word ) => {
					
					return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

				} )
				.join( '_' );

	}

};
