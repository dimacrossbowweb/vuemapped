export class KebabCase {

	static validate ( str ) {

		return /^[a-z]+(-[a-z]+)*$/.test( str );

	}

	static parse ( value ) {

		return value.split( '-' );

	}

	static toString ( words ) {

		return words
				.map( ( word ) => word.toLowerCase() )
				.join( '-' );

	}

};
