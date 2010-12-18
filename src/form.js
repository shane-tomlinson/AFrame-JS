/**
 * A basic form.  A Form is a Composite of form fields.  Each Field contains at least 
 * the following functions, clear, save, reset, validate.  A generic Form is not 
 * bound to any data, it is only a collection of form fields.
 *
 *    <div id="nameForm">
 *       <input type="text" data-field="name" />
 *    </div>
 *   
 *    ---------
 *   
 *    // Sets up the field constructor, right now there is only one type of field
 *    var fieldFactory = function( element ) {
 *       return AFrame.construct( {
 *           type: AFrame.Field,
 *           config: {
 *               target: element
 *           }
 *       } );
 *    };
 *   
 *    // Set up the form to look under #nameForm for elements with the "data-field" 
 *    //   attribute.  This will find one field in the above HTML
 *    //
 *    var form = AFrame.construct( {
 *       type: AFrame.Form,
 *       config: {
 *           target: $( '#nameForm' ),
 *           formFieldFactory: fieldFactory
 *       }
 *    } );
 *   
 *    // do some stuff, user enters data.
 *
 *    // Check the validity of the form
 *    var isValid = form.checkValidity();
 *   
 *    // do some other stuff.
 *   
 *    form.clear();
 *
 * @class AFrame.Form
 * @extends AFrame.Display
 * @constructor
 */
/**
 * The factory to use to create form fields
 * @config formFieldFactory
 * @type {function}
 */
AFrame.Form = function() {
	AFrame.Form.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.Form, AFrame.Display, {
	init: function( config ) {
		this.formFieldFactory = config.formFieldFactory;
		this.formElements = [];
		this.formFields = [];
		
		AFrame.Form.superclass.init.apply( this, arguments );

		this.bindFormElements();
	},

	bindFormElements: function() {
		var formElements = $( '[data-field]', this.getTarget() );
		
		formElements.each( function( index, formElement ) {
			this.bindFormElement( formElement );
		}.bind( this ) );
	},

	teardown: function() {
		this.formFields && this.formFields.forEach( function( formField, index ) {
			formField.teardown();
			this.formFields[ index ] = null;
		}, this );
		this.formFields = null;
		this.formElements = null;
		AFrame.Form.superclass.teardown.apply( this, arguments );
	},
	
	/**
	 * bind a form element to the form
     *
     *    // Bind a field in the given element.
     *    var field = form.bindFormElement( $( '#button' ) );
     *
	 * @method bindFormElement
	 * @param {selector || element} formElement the form element to bind to.
	 * @returns {AFrame.Field}
	 */
	bindFormElement: function( formElement ) {
		var target = $( formElement );
		this.formElements.push( target );

		var formField = this.formFieldFactory( target );
		this.formFields.push( formField );
		
		return formField;
	},
	
	/**
	 * Get the form field elements
     *
     *    // Get the form field elements
     *    var fields = form.getFormElements();
     *
	 * @method getFormElements
	 * @return {array} the form elements
	 */
	getFormElements: function() {
		return this.formElements;
	},

	/**
	 * Get the form fields
     *
     *    // Get the form fields
     *    var fields = form.getFormFields();
     *
	 * @method getFormFields
	 * @return {array} the form fields
	 */
	getFormFields: function() {
		return this.formFields;
	},

	/**
	 * Validate the form.
     *
     *    // Check the validity of the form
     *    var isValid = form.checkValidity();
     *
	 * @method checkValidity
	 * @return {boolean} true if form is valid, false otw.
	 */
	checkValidity: function() {
		var valid = true;

		for( var index = 0, formField; ( formField = this.formFields[ index ] ) && valid; ++index ) {
			valid = formField.checkValidity();
		}
		
		return valid;
	},

	/**
	 * Clear the form, does not affect data
     *
     *    // Clear the form, does not affect data.
     *    form.clear();
     *
	 * @method clear
	 */
	clear: function() {
		this.fieldAction( 'clear' );
	},

	/**
	 * Reset the form to its original state
     *
     *    // Resets the form to its original state.
     *    form.reset();
     *
	 * @method reset
	 */
	reset: function() {
		this.fieldAction( 'reset' );
	},

	/**
	 * Have all fields save their data if the form is valid
     *
     *    // Have all fields save their data if the form is valid
     *    var saved = form.save();
     *
	 * @method save
	 * @return {boolean} true if the form was valid and saved, false otw.
	 */
	save: function() {
		var valid = this.checkValidity();
		if( valid ) {
			this.fieldAction( 'save' );
		}
		
		return valid;
	},

	fieldAction: function( action ) {
		this.formFields.forEach( function( formField, index ) {
			formField[ action ]();
		} );
	}
} );