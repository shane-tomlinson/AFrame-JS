/**
* A Model is a DataContainer that is associated with a Schema.  If no initial data is given, 
*   default values will be retreived from the schema.  When doing a set, only data that validates
*   will be set.  If data to set is invalid, set will return a [FieldValidityState](AFrame.FieldValidityState.html).
* @class AFrame.Model
* @extends AFrame.DataContainer
* @constructor
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
