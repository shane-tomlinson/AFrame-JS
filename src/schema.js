/**
 * A basic data schema, useful for loading/saving data to a persistence store.  When loading data from
 * persistence, if the data is run through the getAppData function, it will make an object with only the fields
 * defined in the schema, and any missing fields will get default values.  If a fixup function is defined
 * for that row, the field's value will be run through the fixup function.  When saving data to persistence,
 * running data through the getFormData will create an object with only the fields specified in the schema.  If
 * a row has save: false defined, the row will not be added to the form data object. If a row has a cleanup 
 * function defined, the corresponding data value will be run through the cleanup function.
 * Generic fixup and persistence functions can be set for a type using the AFrame.Schema.addAppDataCleaner and 
 * AFrame.Schema.addFormDataCleaner.  Every item that has a given type and has a value will have the
 * fixer or persistencer function called, this is useful for doing conversions where the data persistence
 * layer saves data in a different format than the internal application representation.  A useful
 * example of this is ISO8601 date<->Javascript Date.  Already added types are 'number', 'integer',
 * and 'iso8601'.
 * If a row in the schema config has the has_many field, the field is made into an array and the fixup/cleanup functions
 *	are called on each item in the array.  The default default item for these fields is an empty array.  If
 *	there is no data for the field in getFormData, the field is left out of the output.
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
		else if( this.schema[ key ].has_many ) {
			defValue = [];
		}
		else if( AFrame.Schema.getSchema( this.schema[ key ].type ) ) {
			defValue = {};
		}
		return defValue;
	},
	
	/**
	 * Fix a data object for use in the application.  Creates a new object using the specified data 
	 * as a template for values.  If a value is not specified but a default value is specified in the 
	 * schema, the default value is used for that item.  Items are finally run through an optionally defined
	 * fixup function.  If defined, the fixup function should return cleaned data.  If the fixup function
	 * does not return data, the field will be undefined.
	 * @method getAppData
	 * @param {object} dataToFix
	 * @return {object} fixedData
	 */
	getAppData: function( dataToFix ) {
		var fixedData = {};

		this.forEach( function( schemaRow, key ) {
			var value = dataToFix[ key ];
			
			// no value, use default
			if( !AFrame.defined( value ) ) {
				value = this.getDefaultValue( key );
			}
			
			if( schemaRow.has_many ) {
				value && value.forEach && value.forEach( function( current, index ) {
					value[ index ] = this.getAppDataValue( current, schemaRow, dataToFix, fixedData );
				}, this );
			}
			else {
				value = this.getAppDataValue( value, schemaRow, dataToFix, fixedData );
			}
			
			fixedData[ key ] = value;
		}, this );
		
		return fixedData;
	},

	getAppDataValue: function( value, schemaRow, dataToFix, fixedData ) {
		// If the object has a type and there is a schema for the type,
		//	fix up the value.  If there is no schema for the type, but the value
		//	is defined and there is a type converter fix function, convert the value.
		var schema = AFrame.Schema.getSchema( schemaRow.type );
		if( schema ) {
			value = schema.getAppData( value );
		}
		else if( AFrame.defined( value ) ) {
			// call the generic type fixup/conversion function
			var convert = AFrame.Schema.appDataCleaners[ schemaRow.type ];
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
		
		return value;
	},
	
	/**
	 * Get an object suitable to send to persistence.  This is based roughly on converting
	 *	the data to a FormData "like" object - see https://developer.mozilla.org/en/XMLHttpRequest/FormData
	 * @method getFormData
	 * @param {object} dataToClean - data to cleanup for persistence
	 * @return {object} cleanedData
	 */
	getFormData: function( dataToClean ) {
		var cleanedData = {};
		
		this.forEach( function( schemaRow, key ) {
			if( schemaRow.save !== false ) {
				var value = dataToClean[ key ];

				if( schemaRow.has_many ) {
					value && value.forEach && value.forEach( function( current, index ) {
						value[ index ] = this.getFormDataValue( current, schemaRow, dataToClean, cleanedData );
					}, this );
				}
				else {
					value = this.getFormDataValue( value, schemaRow, dataToClean, cleanedData );
				}
				
				cleanedData[ key ] = value;
			}
		}, this );
		
		return cleanedData;
	},
	
	getFormDataValue: function( value, schemaRow, dataToClean, cleanedData ) {
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
			var schema = AFrame.Schema.getSchema( schemaRow.type );
			/*
			* first, check if there is a schema, if there is a schema let the schema
			*	take care of things.  If there is no schema but there is a value and
			*  a saveCleaner, run the value through the save cleaner.
			*/
			if( schema ) {
				value = schema.getFormData( value );
			}
			else {
				var convert = AFrame.Schema.formDataCleaners[ schemaRow.type ];
				if( AFrame.func( convert ) ) {
					value = convert( value );
				}
			}
		}
		
		return value;
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
	appDataCleaners: {},
	formDataCleaners: {},
	schemaConfigs: {},
	schemaCache: {},
	
	/**
	 * Add a universal function that fixes data in getAppDataObject. This is used to convert
	 * data from a version the backend sends to one that is used internally.
	 * @method AFrame.Schema.addAppDataCleaner
	 * @param {string} type - type of field.
	 * @param {function} callback - to call
	 */
	addAppDataCleaner: function( type, callback ) {
		AFrame.Schema.appDataCleaners[ type ] = callback;
	},
	/**
	 * Add a universal function that gets data ready to save to persistence.  This is used
	 * to convert data from an internal representation of a piece of data to a 
	 * representation the backend is expecting.
	 * @method AFrame.Schema.addFormDataCleaner
	 * @param {string} type - type of field.
	 * @param {function} callback - to call
	 */
	addFormDataCleaner: function( type, callback ) {
		AFrame.Schema.formDataCleaners[ type ] = callback;
	},
	
	/**
	* Add a schema config
	* @method AFrame.Schema.addSchemaConfig
	* @param {id} type - identifier type
	* @param {SchemaConfig} config - the schema configuration
	*/
	addSchemaConfig: function( type, config ) {
		AFrame.Schema.schemaConfigs[ type ] = config;
	},
	
	/**
	* Get a schema
	* @method AFrame.Schema.getSchema
	* @param {id} type - type of schema to get, a config must be registered for type.
	* @return {AFrame.Schema}
	*/
	getSchema: function( type ) {
		if( !AFrame.Schema.schemaCache[ type ] && AFrame.Schema.schemaConfigs[ type ] ) {
			AFrame.Schema.schemaCache[ type ] = AFrame.construct( {
				type: AFrame.Schema,
				config: {
					schema: AFrame.Schema.schemaConfigs[ type ]
				}
			} );
		}
		
		return AFrame.Schema.schemaCache[ type ];
	}
} );

AFrame.Schema.addAppDataCleaner( 'number', function( value ) {
	return parseFloat( value );
} );

AFrame.Schema.addAppDataCleaner( 'integer', function( value ) {
	return parseInt( value, 10 );
} );

AFrame.Schema.addAppDataCleaner( 'iso8601', function( str ) {
	// we assume str is a UTC date ending in 'Z'
	try{
		var parts = str.split('T'),
		dateParts = parts[0].split('-'),
		timeParts = parts[1].split('Z'),
		timeSubParts = timeParts[0].split(':'),
		timeSecParts = timeSubParts[2].split('.'),
		timeHours = Number(timeSubParts[0]),
		_date = new Date;
		
		_date.setUTCFullYear(Number(dateParts[0]));
		_date.setUTCMonth(Number(dateParts[1])-1);
		_date.setUTCDate(Number(dateParts[2]));
		_date.setUTCHours(Number(timeHours));
		_date.setUTCMinutes(Number(timeSubParts[1]));
		_date.setUTCSeconds(Number(timeSecParts[0]));
		if (timeSecParts[1]) {
			_date.setUTCMilliseconds(Number(timeSecParts[1]));
		}
		
		// by using setUTC methods the date has already been converted to local time(?)
		return _date;
	}
	catch(e) {}
} );

AFrame.Schema.addFormDataCleaner( 'iso8601', function( date ) {
	return date.toISOString();
} );

