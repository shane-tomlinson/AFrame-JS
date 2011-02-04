/**
 * A basic data schema, useful for defining a data structure, validating data, and preparing data to 
 * be loaded from or saved to a persistence store.  Schema's define the data structure and can
 * be nested to create complex data structures.  Schemas perform serialization duties in getAppData and
 * serializeItems.  Finally, Schemas define ways to perform data validation.
 * 
 * When loading data from persistence, if the data is run through the getAppData function, 
 * it will make an object with only the fields
 * defined in the schema, and any missing fields will get default values.  If a fixup function is defined
 * for that row, the field's value will be run through the fixup function.  When saving data to persistence,
 * running data through the serializeItems will create an object with only the fields specified in the schema.  If
 * a row has 'save: false' defined, the row will not be added to the form data object. If a row has a cleanup 
 * function defined, the corresponding data value will be run through the cleanup function.
 *
 * Generic serialization functions can be set for a type using the AFrame.Schema.addDeserializer and 
 * AFrame.Schema.addSerializer.  These are useful for doing conversions where the data persistence
 * layer saves data in a different format than the internal application representation.  A useful
 * example of this is ISO8601 date<->Javascript Date.  Already added types are 'number', 'integer',
 * and 'iso8601'.
 *
 * If a row in the schema config has the has_many field, the field is made into an array and the fixup/cleanup functions
 *	are called on each item in the array.  The default default item for these fields is an empty array.  If
 *	there is no data for the field in serializeItems, the field is left out of the output.
 *
 *
 *    // Schema defines four fields, two with validators
 *    var librarySchemaConfig = {
 *        name: { type: 'text', validate: {
 *                    minlength: 1,
 *                    maxlength: 75,
 *                    required: true
 *                } },
 *        version: { type: 'text', validate: {
 *                    minlength: 1,
 *                    required: true
 *               } },
 *        create_date: { type: 'iso8601' },
 *        downloads: { type: 'integer', fixup: downloadsFixup, cleanup: downloadsCleanup }
 *    };
 *
 *    function downloadsFixup( options ) {
 *         var value = options.value;
 *         if( value < 0 ) {
 *              value = 0;
 *         }
 *         return value;
 *    };
 *
 *    function downloadsCleanup( options ) {
 *         var value = options.value;
 *         if( value < 0 ) {
 *              value = 0;
 *         }
 *         return value;
 *    };
 *
 *    // recommended to use AFrame.Schema to create schemas so
 *    // that duplicate schemas are not created for the same
 *    // configuration.
 *    var librarySchema = AFrame.Schema( librarySchemaConfig );
 *
 * @class AFrame.Schema
 * @constructor
 */

/**
 * The schema configuration to use for this schema
 * @config schema
 * @type {object}
 */
AFrame.Schema = (function() {
    "use strict";
    
    var SCHEMA_ID_KEY = '__SchemaID';
    
    var Schema = function( config ) {
        if( config ) {
            if( !config[ SCHEMA_ID_KEY ] ) {
                config[ SCHEMA_ID_KEY ] = AFrame.getUniqueID();
                Schema.addSchemaConfig( config[ SCHEMA_ID_KEY ], config );
            }
            
            return Schema.getSchema( config[ SCHEMA_ID_KEY ] );
        }
        else {
            Schema.sc.constructor.call( this );
        }
    };
    AFrame.extend( Schema, AFrame.AObject, {
        init: function( config ) {
            this.schema = config.schema;
            
            if( !config.schema ) {
                throw 'Schema.js: Schema requires a schema configuration object';
            }
            
            Schema.sc.init.call( this, config );
        },

        /**
         * Get an object with the default values specified.  Only returns values
         * of objects with a defined default.
         *
         *    // get the default values for all fields.
         *    var defaults = schema.getDefaults();
         *
         * @method getDefaults
         * @return {object} object with default values
         */
        getDefaults: function() {
            var defaultObject = {};

            this.forEach( function( schemaRow, key ) {
                defaultObject[ key ] = this.getDefaultValue( key );
            }, this );
            
            return defaultObject;
        },

        /**
        * Get the default value for a particular item
        *
        *    // get the default value for a particular item
        *    var value = schema.getDefaultValue( 'name' );
        *
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
            else if( Schema.getSchema( this.schema[ key ].type ) ) {
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
         *
         *     // dbData is data coming from the database, still needs to be deserialized.
         *     var appData = schema.getAppData( dbData );
         *
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
            var schema = Schema.getSchema( schemaRow.type );
            if( schema ) {
                value = schema.getAppData( value );
            }
            else if( AFrame.defined( value ) ) {
                // call the generic type deserializer function
                var convert = Schema.deserializers[ schemaRow.type ];
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
         *	the data to a [FormData](https://developer.mozilla.org/en/XMLHttpRequest/FormData) "like" object - see [MDC](https://developer.mozilla.org/en/XMLHttpRequest/FormData)
         *	All items in the schema that do not have save parameter set to false and have values defined in dataToSerialize 
         *	will have values returned.
         *
         *     // appData is data from the application ready to send to the DB, needs serialized.
         *     var serializedData = schema.serializeItems( appData );
         *
         * @method serializeItems
         * @param {object} dataToSerialize - data to clean up
         * @return {object} cleanedData
         */
        serializeItems: function( dataToSerialize ) {
            var cleanedData = {};
            
            this.forEach( function( schemaRow, key ) {
                if( schemaRow.save !== false ) {
                    var value = dataToSerialize[ key ];

                    if( schemaRow.has_many ) {
                        value && value.forEach && value.forEach( function( current, index ) {
                            value[ index ] = this.getSerializedValue( current, schemaRow, dataToSerialize, cleanedData );
                        }, this );
                    }
                    else {
                        value = this.getSerializedValue( value, schemaRow, dataToSerialize, cleanedData );
                    }
                    
                    cleanedData[ key ] = value;
                }
            }, this );
            
            return cleanedData;
        },
        
        getSerializedValue: function( value, schemaRow, dataToSerialize, cleanedData ) {
            // apply the cleanup function if defined.
            var cleanup = schemaRow.cleanup;
            if( AFrame.defined( cleanup ) ) {
                value = cleanup( {
                    value: value,
                    data: dataToSerialize,
                    cleaned: cleanedData
                } );
            }

            if( AFrame.defined( value ) ) {
                var schema = Schema.getSchema( schemaRow.type );
                /*
                * first, check if there is a schema, if there is a schema let the schema
                *	take care of things.  If there is no schema but there is a value and
                *  a saveCleaner, run the value through the save cleaner.
                */
                if( schema ) {
                    value = schema.serializeItems( value );
                }
                else {
                    var convert = Schema.serializers[ schemaRow.type ];
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
                if( key !== SCHEMA_ID_KEY ) {
                    var schemaRow = this.schema[ key ];
                    callback.call( context, schemaRow, key );
                }
            }
        },
        
        /**
        * Check to see if a row is labeled with "has many"
        * @method rowHasMany
        * @param {string} rowName
        * @return {boolean} true if row is marked as "has_many", false otw.
        */
        rowHasMany: function( rowName ) {
            return !!( this.schema[ rowName ] && this.schema[ rowName ].has_many );
        },
        
        /**
        * Validate a set of data against the schema
        *
        *    // validate, but ignore fields defined in the schema that are missing from data.
        *    var validity = schema.validate( data, true );
        *    // validity is true if all data is valid
        *    // validity is an an object with each field in data, 
        *    // for each field there is an [AFrame.FieldValidityState](AFrame.FieldValidityState.html)
        *
        * @method validate
        * @param {object} data - data to validate
        * @param {boolean} ignoreMissing (optional) - if set to true, fields missing from data are not validated.  Defaults to false.
        *   Note, even if set to true, and a field in data has an undefined value, the field will be validated against the
        *   the undefined value.
        * @return {variant} true if all fields are valid, an object with each field in data, for each field there 
        *   is an [AFrame.FieldValidityState](AFrame.FieldValidityState.html)
        */
        validate: function( data, ignoreMissing ) {
            var statii = {};
            var areErrors = false;
            
            this.forEach( function( row, key ) {
                var rowCriteria = row.validate || {};
                var criteriaCopy = jQuery.extend( { type: row.type }, rowCriteria );
                var field = data[ key ];
                
                // Check hasOwnProperty so that if a field is defined in data, but has an undefined value,
                //  even if ignoreMissing is set to true, we validate against it.
                if( !ignoreMissing || data.hasOwnProperty( key ) ) {
                    var validityState = this.validateData( data[ key ], criteriaCopy );
                    // if the row is valid, then just give the row a true status
                    if( validityState.valid ) {
                        statii[ key ] = true;
                    }
                    else {
                        // the row is invalid, so save its validityState.
                        statii[ key ] = validityState;
                        areErrors = true;
                    }
                }
            }, this );
            
            return areErrors ? statii : true;
        },
        
        validateData: function( data, criteria ) {
            return AFrame.DataValidation.validate( {
                data: data,
                criteria: criteria 
            } );
        }
    } );
    AFrame.mixin( Schema, {
        deserializers: {},
        serializers: {},
        schemaConfigs: {},
        schemaCache: {},
        
        /**
         * Add a universal function that fixes data in [getAppData](#method_getAppData). This is used to convert
         * data from a version the backend sends to one that is used internally.
         * @method Schema.addDeserializer
         * @param {string} type - type of field.
         * @param {function} callback - to call
         */
        addDeserializer: function( type, callback ) {
            Schema.deserializers[ type ] = callback;
        },
        
        /**
         * Add a universal function that gets data ready to save to persistence.  This is used
         * to convert data from an internal representation of a piece of data to a 
         * representation the backend is expecting.
         * @method Schema.addSerializer
         * @param {string} type - type of field.
         * @param {function} callback - to call
         */
        addSerializer: function( type, callback ) {
            Schema.serializers[ type ] = callback;
        },
        
        /**
        * Add a schema config
        * @method Schema.addSchemaConfig
        * @param {id} type - identifier type
        * @param {SchemaConfig} config - the schema configuration
        */
        addSchemaConfig: function( type, config ) {
            Schema.schemaConfigs[ type ] = config;
        },
        
        /**
        * Get a schema
        * @method Schema.getSchema
        * @param {id} type - type of schema to get, a config must be registered for type.
        * @return {Schema}
        */
        getSchema: function( type ) {
            if( !Schema.schemaCache[ type ] && Schema.schemaConfigs[ type ] ) {
                Schema.schemaCache[ type ] = AFrame.construct( {
                    type: Schema,
                    config: {
                        schema: Schema.schemaConfigs[ type ]
                    }
                } );
            }
            
            return Schema.schemaCache[ type ];
        }
    } );

    Schema.addDeserializer( 'number', function( value ) {
        return parseFloat( value );
    } );

    Schema.addDeserializer( 'integer', function( value ) {
        return parseInt( value, 10 );
    } );

    Schema.addDeserializer( 'iso8601', function( str ) {
        if( 'string' == typeof( str ) ) {
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
        }
        else if( str instanceof Date ) {
            return str;
        }
    } );

    Schema.addSerializer( 'iso8601', function( date ) {
        return date.toISOString();
    } );
    
    return Schema;
    
}() );
