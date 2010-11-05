/**
 * A basic form.  Forms are made of form fields.  A field should contain at least the following functions, clear, save, reset, validate.
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
		
		AFrame.Form.superclass.init.apply( this, arguments );

		this.bindFormElements();
	},

	bindFormElements: function() {
		var target = this.getTarget();

		this.formElements = $( '[data-field]', target );
		this.formFields = [];
		
		this.formElements.each( function( index, formElement ) {
			var field = this.formFieldFactory( $( formElement ) );
			this.formFields.push( field );
		}.bind( this ) );
	},

	/**
	 * Get the form elements
	 * @method getFormElements
	 * @return {array} the form elements
	 */
	getFormElements: function() {
		return this.formElements;
	},

	/**
	 * Get the form fields
	 * @method getFormFields
	 * @return {array} the form fields
	 */
	getFormFields: function() {
		return this.formFields;
	},

	/**
	 * Validate the form.
	 * @method validate
	 * @return {boolean} true if form is valid, false otw.
	 */
	validate: function() {
		var valid = true;

		for( var index = 0, formField; ( formField = this.formFields[ index ] ) && valid; ++index ) {
			valid = formField.validate();
		}
		
		return valid;
	},

	/**
	 * Clear the form, does not affect data
	 * @method clear
	 */
	clear: function() {
		this.fieldAction( 'clear' );
	},

	/**
	 * Reset the form to its original state
	 * @method reset
	 */
	reset: function() {
		this.fieldAction( 'reset' );
	},

	/**
	 * Have all fields save their data if the form is valid
	 * @method save
	 * @return {boolean} true if the form was valid and saved, false otw.
	 */
	save: function() {
		var valid = this.validate();
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