/**
 * A basic form.  Forms are bound to a dataContainer.
 * @class AFrame.Form
 * @extends AFrame.Display
 * @constructor
 */
/**
 * The DataContainer to bind the form to
 * @config dataContainer
 * @type {DataContainer}
 */
/**
 * The factory to use to create form fields
 * @config formFieldFactory
 * @type {function}
 */
/**
 * Generic options to pass to the field constructor
 * @config fieldOptions
 * @type {object} (optional)
 */
AFrame.Form = function() {
	AFrame.Form.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.Form, AFrame.Display, {
	init: function( config ) {
		this.dataContainer = config.dataContainer;
		this.formFieldFactory = config.formFieldFactory;
		this.fieldOptions = config.fieldOptions;
		
		AFrame.Form.superclass.init.apply( this, arguments );

		this.bindFormElements();
	},

	bindFormElements: function() {
		var target = this.getTarget();

		this.formElements = $( '[data-field]', target );
		this.formFields = [];
		
		this.formElements.each( function( index, formElement ) {
			var field = this.formFieldFactory( $( formElement ), this.dataContainer, this.fieldOptions );
			this.formFields.push( field );
		}.bind( this ) );
	},

	/**
	 * Get the form elements
	 * @method getFormElements
	 * @return {array} the form elements dataContainer
	 */
	getFormElements: function() {
		return this.formElements;
	},

	/**
	 * Get the form fields
	 * @method getFormFields
	 * @return {array} the form fields dataContainer
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
	 * Save the form data to the dataContainer.
	 * @method save
	 */
	save: function() {
		if( this.validate() ) {
			this.fieldAction( 'save' );
		}
	},

	fieldAction: function( action ) {
		this.formFields.forEach( function( formField, index ) {
			formField[ action ]();
		} );
	}
} );