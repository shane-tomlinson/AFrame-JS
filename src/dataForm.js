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
*    var form = AFrame.create( AFrame.DataForm, {
*       target: '#nameForm',
*       dataSource: libraryDataContainer
*    } );
*    
*    // do some stuff, user updates the fields with the library name and version 
*    //    number. Note, throughout this period the libraryDataContainer is never 
*    //    updated.
*
*    // Check the validity of the form, if we are valid, save the data back to 
*    //    the dataContainer.
*    var isValid = form.checkValidity();
*    if( isValid ) {
*        // if the form is valid, the input is saved back to 
*        //    the libraryDataContainer
*        form.save();
*    }
*
* If setting up a DataForm with a [Model](AFrame.Model.html), when validating the form,
*   the model's validators will be called as well.  This is useful to do specialized
*   model level validation.
*
*    // Schema defines two fields with validators
*    var schemaConfig = {
*        name: { type: 'text', validate: {
*                    minlength: 1,
*                    maxlength: 75,
*                    required: true
*                } },
*        version: { type: 'text', validate: {
*                    minlength: 1,
*                    required: true
*               } }
*    };
*
*    // create the model.
*    var model = AFrame.create( AFrame.Model, {
*        schema: schemaConfig
*    } );
*
*    // Set up the form to look under #nameForm for elements with the "data-field" 
*    //    attribute.  The name of each field will be that specified in the element's "name"
*    //    attribute.  This will try and tie fields to name and version, as specified in the schemaConfig.
*    var form = AFrame.create( AFrame.DataForm, {
*        target: '#nameForm',
*        dataSource: model
*    } );
*    
*
* @class AFrame.DataForm
* @extends AFrame.Form
* @constructor
*/

AFrame.DataForm = ( function() {
    "use strict";
    
    var DataForm = AFrame.Class( AFrame.Form, {
	    init: function( config ) {
		    /**
		     * The source of data
		     * @config dataSource
		     * @type {AFrame.DataContainer || Object}
		     */
		    this.dataContainer = AFrame.DataContainer( config.dataSource );
		
		    DataForm.sc.init.call( this, config );
	    },
	
	    teardown: function() {
		    this.dataContainer = null;
		    DataForm.sc.teardown.call( this );
	    },
	
	    bindFormElement: function( formElement ) {
		    var formField = DataForm.sc.bindFormElement.call( this, formElement );
		    var fieldName = fieldGetName( formField );
		
		    this.dataContainer.bindField( fieldName, fieldSetValue, formField );
		
		    return formField;
	    },

	    checkValidity: function() {
		    var valid = DataForm.sc.checkValidity.call( this ) && this.validateFormFieldsWithModel( this.dataContainer );
		
		    return valid;
	    },
	
	    save: function() {
		    var valid = DataForm.sc.save.apply( this, arguments );
		
		    if( valid ) {
                this.forEach( function( formField, index ) {
				    var fieldName = fieldGetName( formField );
				    this.dataContainer.set( fieldName, formField.get() );
			    }, this );
		    }
		
		    return valid;
	    },
        
        /**
        * Validate the form against a model.
        *
        * @method validateFormFieldsWithModel
        * @param {AFrame.Model} model - the model to validate against
        * @return {boolean} - true if form validates, false otw.
        */
        validateFormFieldsWithModel: function( model ) {
            var valid = true;

            // only validate vs the dataContainer if the dataContainer has validation.
            if( model.checkValidity ) {
                valid = validateFormFieldsWithModel.call( this, model );
            }

            return valid;
        }
    } );

    // Some helper functions that should probably be on the Field itself.
    function validateFormFieldsWithModel( model ) {
        var valid = true;
        this.forEach( function( formField, index ) {
            var fieldName = fieldGetName( formField );
            var validityState = model.checkValidity( fieldName, formField.get() );
        
            if( validityState !== true ) {
                valid = false;
                fieldUpdateValidityState( formField, validityState );
            }
        }, this );
            
        return valid;	
    }

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
        return AFrame.DOM.getAttr( formField.getTarget(), 'name' );
    }

    function fieldSetValue( data ) {
        this.set( data.value );
    }

    
    return DataForm;
} )();
