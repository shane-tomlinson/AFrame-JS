/**
 * A basic data schema, useful for loading/saving data to a persistence store.  When loading data from
 * persistence, if the data is run through the fixData function, it will make an object with only the fields
 * defined in the schema, and any missing fields will get default values.  If a fixup function is defined
 * for that row, the field's value will be run through the fixup function.  When saving data to persistence,
 * running data through the cleanData will create an object with only the fields specified in the schema.  If
 * a row has a cleanup function defined, the corresponding data value will be run through the cleanup function.
 * @class AFrame.Schema
 * @extends AFrame.AObject
 * @constructor
 */

/**
 * The schema configuration to use for this schema
 * @config schema
 * @type {object}
 */
AFrame.Schema = function() {
	AFrame.Schema.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.Schema, AFrame.AObject, {
	init: function( config ) {
		this.schema = config.schema;

		AFrame.Schema.superclass.init.apply( this, arguments );
	},

	/**
	 * Get an object with the default values specified.  Only returns values
	 * of objects with a defined default.
	 * @method getDefaults
	 * @return {object} object with default values
	 */
	getDefaults: function() {
		var defaultObject = {};
		for( var key in this.schema ) {
			defaultObject[ key ] = this.getDefaultValue( key );
		}
		return defaultObject;
	},

	/**
	* Get the default value for a particular item
	* @method getDefaultValue
	* @param {string} key - name of item to get default value for
	* @return {variant} default value if one is defined
	*/
	getDefaultValue: function( key ) {
		var defValue = this.schema[ key ].def;
		if( AFrame.func( defValue ) ) {
			defValue = defValue();
		}
		return defValue;
	},
	
	/**
	 * Fix a data object for use.  Creates a new object using the specified data as a basis
	 * for values.  If a value is not specified but a default value is specified in the schema,
	 * the default value is used for that item.  Items are finally run through an optionally defined
	 * fixup function.  If defined, the fixup function should return cleaned data.  If the fixup function
	 * does not return data, the field will be undefined.
	 * @method fixData
	 * @param {object} dataToFix
	 * @return {object} fixedData
	 */
	fixData: function( dataToFix ) {
		var fixedData = {};

		this.forEach( function( schemaRow, key ) {
			var value = dataToFix[ key ];
			
			// no value, use default
			if( !AFrame.defined( value ) ) {
				value = this.getDefaultValue( key );
			}
			
			if( AFrame.defined( value ) ) {
				// call the generic type fixup/conversion function
				var convert = AFrame.Schema.fixFuncs[ schemaRow.type ];
				if( AFrame.func( convert ) ) {
					value = convert( value );
				}
			}
			
			// apply the fixup function if defined.
			var fixup = schemaRow.fixup;
			if( AFrame.func( fixup ) ) {
				value = fixup( {
					value: value,
					data: dataToFix,
					fixed: fixedData
				} );
			}
			
			fixedData[ key ] = value;
		}, this );
		
		return fixedData;
	},

	/**
	 * Get an object suitable to send to persistence
	 * @method getPersistenceObject
	 * @param {object} dataToClean - data to cleanup for persistence
	 * @return {object} cleanedData
	 */
	getPersistenceObject: function( dataToClean ) {
		var cleanedData = {};
		
		this.forEach( function( schemaRow, key ) {
			var value = dataToClean[ key ];

			// apply the cleanup function if defined.
			var cleanup = schemaRow.cleanup;
			if( AFrame.defined( cleanup ) ) {
				value = cleanup( {
					value: value,
					data: dataToClean,
					cleaned: cleanedData
				} );
			}

			if( AFrame.defined( value ) ) {
				var convert = AFrame.Schema.persistenceFuncs[ schemaRow.type ];
				if( AFrame.func( convert ) ) {
					value = convert( value );
				}
			}
			
			cleanedData[ key ] = value;
		} );
		
		return cleanedData;
	},

	/**
	 * An iterator.  Iterates over every row in the schema.
	 * The callback is called with the schema row and the key of the row.
	 * @method forEach
	 * @param {function} callback - callback to call.
	 * @param {object} context (optional) context to call callback in
	 */
	forEach: function( callback, context ) {
		for( var key in this.schema ) {
			var schemaRow = this.schema[ key ];
			callback.call( context, schemaRow, key );
		}
	}
} );
AFrame.mixin( AFrame.Schema, {
	fixFuncs: {},
	persistenceFuncs: {},
	/**
	 * Add a universal function that fixes data in fixDataObject. This is used to convert
	 * data from a version the backend sends to one that is used internally.
	 * @method AFrame.Schema.addFixer
	 * @param {string} type - type of field.
	 * @param {function} callback - to call
	 */
	addFixer: function( type, callback ) {
		AFrame.Schema.fixFuncs[ type ] = callback;
	},
	/**
	 * Add a universal function that gets data ready to save to persistence.  This is used
	 * to convert data from an internal representation of a piece of data to a 
	 * representation the backend is expecting.
	 * @method AFrame.Schema.addPersistencer
	 * @param {string} type - type of field.
	 * @param {function} callback - to call
	 */
	addPersistencer: function( type, callback ) {
		AFrame.Schema.persistenceFuncs[ type ] = callback;
	}
} );

AFrame.Schema.addFixer( 'number', function( value ) {
	return parseFloat( value );
} );
AFrame.Schema.addFixer( 'integer', function( value ) {
	return parseInt( value, 10 );
} );