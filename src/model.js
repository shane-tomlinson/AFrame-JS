/**
* A Model is a DataContainer that is associated with a Schema.  If no initial data is given, 
*   default values will be retreived from the schema.  When doing a set, only data that validates
*   will be set.  If data to set is invalid, set will return a [FieldValidityState](AFrame.FieldValidityState.html).
*
*    // create the schema config
*    var noteSchemaConfig = {
*        id: { type: 'integer' },
*        title: { type: 'text', def: 'Note Title' },
*        contents: { type: 'text' },
*        date: { type: 'iso8601' },
*        edit_date: { type: 'iso8601' }
*    };
*
*    // create one schema for all models of the same type
*    var noteSchema = AFrame.construct( {
*        type: AFrame.Schema,
*        config: {
*            schema: noteSchemaConfig
*        }
*    } );
*    
*    // Create one instance of the model.
*    var model = AFrame.construct( {
*        type: AFrame.Model,
*        config: {
*            schema: noteSchema,
*            data: {
*                id: '1',
*                title: 'Get some milk',
*                contents: 'Go to the supermarket and grab some milk.',
*                date: '2010-12-10T18:09Z',
*                edit_date: '2010-12-10T18:23Z'
*                extra_field: 'this field does not get through'
*           }
*       }
*    } );
*
*    // update a field.  prevVal will be 'Get some milk'
*    var prevVal = model.set( 'title', 'Get some milk and eggs' );
*
*    // This is setting the date in error, the prevVal will have a FieldValidityState
*    // with its typeMismatch field set to true.  This will NOT actually set the value.
*    prevVal = model.set( 'edit_date', '1' );
*
*    // Check the overall model for validity.  Returns true if all valid, an object of
*    // of FieldValidityStates otherwise
*    var isValid = model.checkValidity();
*
* @class AFrame.Model
* @extends AFrame.DataContainer
* @constructor
*/
/**
* The schema to use for the model.
* @config schema
* @type {AFrame.Schema}
*/
/**
* Initial data to use for the model.  Note, initial data is not validated in any way.  If
*   data is not given, data is taken out of the schema's default values.
* @config data
* @type {object}
*/
AFrame.Model = ( function() {
    
    function Model() {
        Model.sc.constructor.call( this );
    }
    AFrame.extend( Model, AFrame.DataContainer, {
        init: function( config ) {
            this.schema = config.schema;
            config.data = getInitialData( this.schema, config.data );
            
            Model.sc.init.call( this, config );
        },
        
	    /**
	    * Set an item of data.  Model will only be updated if data validates.  If data validates, the previous
	    * value will be returned.  If data does not validate, a [FieldValidityState](AFrame.FieldValidityState.html)
	    * will be returned.
        *
        *    var retval = model.set( 'name', 'Shane Tomlinson' );
        *    if( retval !== true ) {
        *        // something went wrong
        *    }
        *
	    * @method set
	    * @param {string} fieldName name of field
	    * @param {variant} fieldValue value of field
	    * @return {variant} previous value of field if correctly set, a 
	    *   [FieldValidityState](AFrame.FieldValidityState.html) otherwise
	    */
        set: function( fieldName, fieldValue ) {
            var fieldValidity = this.checkValidity( fieldName, fieldValue );
            
            if( true === fieldValidity ) {
                fieldValidity = Model.sc.set.call( this, fieldName, fieldValue );
            }
            
            return fieldValidity;
        },
        
        /**
        * Check the validity of the potential value of a field
        *
        *
        *    var retval = model.checkValidity( 'name', 'Shane Tomlinson' );
        *    if( retval !== true ) {
        *        // something went wrong, value would be invalid.
        *    }
        *
        * @method checkValidity
	    * @param {string} fieldName name of field
	    * @param {variant} fieldValue potential value of field
	    * @return {variant} true if field would be valid, a 
	    *   [FieldValidityState](AFrame.FieldValidityState.html) otherwise
        */
        checkValidity: function( fieldName, fieldValue ) {
            var data = {};
            data[ fieldName ] = fieldValue;
            
            var fieldValidity = this.schema.validate( data, true );
            
            if( fieldValidity !== true ) {
                fieldValidity = fieldValidity[ fieldName ];
            }
            
            return fieldValidity;
        },
        
        /**
        * Get an object suitable to send to persistence.  This is based roughly on converting
        *	the data to a [FormData](https://developer.mozilla.org/en/XMLHttpRequest/FormData) "like" object - see [MDC](https://developer.mozilla.org/en/XMLHttpRequest/FormData)
        *	All items in the schema that do not have save parameter set to false and have values defined in dataToSerialize 
        *	will have values returned.
        *
        *     // Get an object suitable to send to persistence.
        *     var serializedData = model.serializeItems();
        *
        * @method serializeItems
        * @return {object}
        */
        serializeItems: function() {
            var dataObject = this.getDataObject();
            return this.schema.serializeItems( dataObject );
        }
    } );
    
    return Model;
    
    function getInitialData( schema, initialData ) {
        if( !initialData ) {
            initialData = schema.getDefaults();
        }
        return initialData;
    }

    
} )();
