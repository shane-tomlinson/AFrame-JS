/**
* A Form that is bound to data.  Each DataForm is bound to a DataContainer, the DataContainer
*	is used as the data source for all form Fields.  When a Field in the form is created, it
*	has its value set to be that of the corresponding field in the DataContainer.  When Fields
*	are updated, the DataContainer is not updated until the form's save function is called.
*    
*    var libraryDataContainer = AFrame.DataContainer( {
*        name: 'AFrame',
*        version: '0.0.20'
*    } );
*    
*    // Set up the form to look under #nameForm for elements with the "data-field" 
*    //    attribute.  This will find two fields, each field will be tied to the 
*    //    appropriate field in the libraryDataContainer
*    var form = AFrame.construct( {
*        type: DataForm,
*        config: {
*            target: $( '#nameForm' ),
*            dataSource: libraryDataContainer
*        }
*    } );
*    
*    // do some stuff, user updates the fields with the library name and version 
*    //    number. Note, throughout this period the libraryDataContainer is never 
*    //    updated.
*
*    // Check the validity of the form, if we are valid, save the data back to 
*    //    the dataContainer
*    var isValid = form.checkValidity();
*    if( isValid ) {
*        // if the form is valid, the input is saved back to 
*        //    the libraryDataContainer
*        form.save();
*    }
*
* @class AFrame.DataForm
* @extends AFrame.Form
* @constructor
*/

AFrame.DataForm = ( function() {
    var DataForm = function() {
	    DataForm.superclass.constructor.apply( this, arguments );
    };
    
    AFrame.extend( DataForm, AFrame.Form, {
	    init: function( config ) {
		    /**
		     * The source of data
		     * @config dataSource
		     * @type {AFrame.DataContainer || Object}
		     */
		    this.dataContainer = AFrame.DataContainer( config.dataSource );
		
		    DataForm.superclass.init.apply( this, arguments );
	    },
	
	    teardown: function() {
		    this.dataContainer = null;
		    DataForm.superclass.teardown.apply( this, arguments );
	    },
	
	    bindFormElement: function( formElement ) {
		    var formField = DataForm.superclass.bindFormElement.apply( this, arguments );
		    var fieldName = fieldGetName( formField );
		
		    this.dataContainer.bindField( fieldName, fieldSetValue, formField );
		
		    return formField;
	    },

	    checkValidity: function() {
		    var valid = DataForm.superclass.checkValidity.call( this );
		    if( valid && this.dataContainer.checkValidity ) {
    		    // only validate vs the dataContainer if the dataContainer has validation.
		        valid = this.validateFormFieldsWithModels();
		    }
		
		    return valid;
	    },

	    validateFormFieldsWithModels: function() {
		    var valid = true;
		    var formFields = this.getFormFields();
		    formFields.forEach( function( formField, index ) {
			    var fieldName = fieldGetName( formField );
			    var validityState = this.dataContainer.checkValidity( fieldName, formField.get() );
			
			    if( validityState !== true ) {
				    valid = false;
				    fieldUpdateValidityState( formField, validityState );
			    }
		    }, this );
		    	
		    return valid;	
	    },
	
	    save: function() {
		    var valid = DataForm.superclass.save.apply( this, arguments );
		
		    if( valid ) {
			    var formFields = this.getFormFields();
			    formFields.forEach( function( formField, index ) {
				    var fieldName = fieldGetName( formField );
				    this.dataContainer.set( fieldName, formField.get() );
			    }, this );
		    }
		
		    return valid;
	    }
    } );

    // Some helper functions that should probably be on the Field itself.
    function fieldUpdateValidityState( formField, validityState ) {
        for( var key in validityState ) {
            if( validityState.hasOwnProperty( key ) ) {
                var val = validityState[ key ];
                if( val === true ) {
                    formField.setError( key );
                }
                else if( 'string' == typeof( val ) ) {
                    formField.setCustomValidity( val );
                }            
            }
        }
    }

    function fieldGetName( formField ) {
        return formField.getTarget().attr( 'data-field' );
    }

    function fieldSetValue( data ) {
        this.set( data.value );
    }


    return DataForm;
} )();
