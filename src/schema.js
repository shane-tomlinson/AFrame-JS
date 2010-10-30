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
			var defValue = this.schema[ key ].def;
			if( AFrame.defined( defValue ) ) {
				defaultObject[ key ] = defValue;
			}
		}
		return defaultObject;
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

		for( var key in this.schema ) {
			var schemaRow = this.schema[ key ];
			var value = dataToFix[ key ];

			// no value, use default
			if( !AFrame.defined( value ) ) {
				value = schemaRow.def;
			}

			// apply the fixup function if defined.
			var fixup = schemaRow.fixup;
			if( AFrame.defined( fixup ) ) {
				value = fixup( {
					value: value,
					data: dataToFix,
					fixed: fixedData
				} );
			}

			fixedData[ key ] = value;
		}
		
		return fixedData;
	}
} );