/**
* A Form that is bound to data.  Each DataForm is bound to a DataContainer,
* (or Model), the DataContainer is used as the data source for all form Fields.
* When a Field in the form is created, it has its value set to be that of the
* corresponding field in the DataContainer.  Unless the "autosave" config
* attribute is set to true, the DataContainer's values are not updated,
* even if a field's value changes, until the form's save function is called.
*
*###Example####
* The following example can be founds on <a target="_blank"
* href="http://jsfiddle.net/shane_tomlinson/anwKE/">JSFiddle</a>
*
*####Setting up the HTML####
*
* Use the "data-field" attribute on an element to specify that an element
* is a form field. The "name" attribute is the name of the field to bind to.
*
*    <fieldset id="nameForm">
*        <input type="string" name="name" data-field />
*        <input type="string" name="version" data-field />
*    </formset>
*
*
*####Working in Javascript####
*
*    var libraryDataContainer = AFrame.DataContainer( {
*        name: 'AFrame',
*        version: '0.0.20'
*    } );
*
*    // Set up the form to look under #nameForm for elements with the "data-field"
*    //    attribute.  This will find two fields, each field will be tied to the
*    //    appropriate field in the libraryDataContainer
*    var form = AFrame.DataForm.create( {
*       target: '#nameForm',
*       data: libraryDataContainer
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
*####Data Forms with Models####
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
*    var model = AFrame.Model.create( {
*        schema: schemaConfig
*    } );
*
*    // Set up the form to look under #nameForm for elements with the "data-field"
*    //    attribute.  The name of each field will be that specified in the
*    //    element's "name" attribute.  This will try and tie fields to name
*    //    and version, as specified in the schemaConfig.
*    var form = AFrame.DataForm.create( {
*        target: '#nameForm',
*        data: model
*    } );
*
*####Multiple Views####
* One of the really powerful concepts that DataForms and the MVC pattern in
* general provide is the ability to attach multiple views to the same data.
* This is very useful in situations where you have one input view and another
* output view that depends on the same data.  This example is shown on <a target="_blank"
* href="http://jsfiddle.net/shane_tomlinson/crqpU/">JSFiddle</a>.
*
*#####HTML#####
*
*    <fieldset id="inputSet">
*        <input type="string" name="name" data-field />
*        <input type="string" name="version" data-field />
*    </fieldset>
*
*    <fieldset id="outputSet">
*        <p>Name: <span name="name" data-field></span></p>
*        <p>Version: <span name="version" data-field></span></p>
*    </fieldset>
*
*#####Javascript#####
*
*    var libraryDataContainer = AFrame.DataContainer( {
*        name: 'AFrame',
*        version: '0.0.20'
*    } );
*
*    var form = AFrame.DataForm.create( {
*        autosave: true,
*        target: '#inputSet',
*        data: libraryDataContainer
*    } );
*
*    var form = AFrame.DataForm.create( {
*        target: '#outputSet',
*        data: libraryDataContainer
*    } );
*
* @class AFrame.DataForm
* @extends AFrame.Form
* @constructor
*/

/**
 * If set to true, the form's DataContainer is automatically updated when
 * a field is updated and is valid.  Example shown on <a target="_blank"
 * href="http://jsfiddle.net/shane_tomlinson/2QgeG/">JSFiddle</a>
 *
 * @config autosave
 * @type {boolean}
 * @default false
 */

AFrame.DataForm = ( function() {
    "use strict";

    var DataForm = AFrame.Form.extend( {
        importconfig: [ 'autosave' ],
	    init: function( config ) {
		    /**
		     * The source of data
		     * @config data
		     * @type {AFrame.DataContainer || Object}
		     */
		    this.dataContainer = AFrame.DataContainer.create( { data: config.data } );

		    DataForm.sc.init.call( this, config );
	    },

	    teardown: function() {
		    this.dataContainer = null;
		    DataForm.sc.teardown.call( this );
	    },

	    bindFormElement: function( formElement ) {
            var me=this,
		        formField = DataForm.sc.bindFormElement.call( me, formElement ),
		        fieldName = fieldGetName( formField );

		    me.dataContainer.bindField( fieldName, fieldSetValue, formField );
            if( me.autosave ) {
                formField.bindEvent( 'onChange', onFieldChange, me );
            }

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

    function onFieldChange( event, formField, val ) {
        var me=this,
            fieldName = fieldGetName( formField );
        if( val !== me.dataContainer.get( fieldName ) ) {
            me.save();
        }
    }

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
