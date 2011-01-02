/**
* A Model is a DataContainer that is associated with a Schema.
* @class AFrame.Model
* @extends AFrame.AObject
* @constructor
*/
AFrame.Model = ( function() {
    
    function Model() {
        Model.superclass.constructor.call( this );
    }
    AFrame.extend( Model, AFrame.AObject, {
        init: function( config ) {
            this.schema = config.schema;
            var initialData = this.getInitialData( config );
            this.dataContainer = AFrame.DataContainer( initialData );

            this.delegateFunc( 'get' );
            
            Model.superclass.init.call( this, config );
        },

        getInitialData: function( config ) {
            var initialData = config.data;
            if( !initialData ) {
                initialData = this.schema.getDefaults();
            }
            return initialData;
        },

        delegateFunc: function( funcName ) {
            var dataContainer = this.dataContainer;
            this[ funcName ] = dataContainer[ funcName ].bind( dataContainer );
        },
        
	    /**
	    * Set an item of data.  
        *
        *    model.set( 'name', 'Shane Tomlinson' );
        *
	    * @method set
	    * @param {string} fieldName name of field
	    * @param {variant} fieldValue value of field
	    * @return {variant} previous value of field if correctly set, a 
	    *   [FieldValidityState](AFrame.FieldValidityState.html) otherwise
	    */
        set: function( fieldName, fieldValue ) {
            var data = {};
            data[ fieldName ] = fieldValue;

            var fieldValidity = this.schema.validate( data, true );
            var retval;
            if( true === fieldValidity ) {
                retval = this.dataContainer.set( fieldName, fieldValue );
            }
            else {
                retval = fieldValidity[ fieldName ];
            }
            
            return retval;
        }
    } );
    
    return Model;
} )();
