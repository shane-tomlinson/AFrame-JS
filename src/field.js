/**
 * The base class for a field.  A field is a basic unit for a form.
 * @class AFrame.Field
 * @extends AFrame.Display
 * @constructor
 */
AFrame.Field = function() {
	AFrame.Field.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.Field, AFrame.Display, {
	init: function( config ) {
		AFrame.Field.superclass.init.apply( this, arguments );

		this.resetVal = this.getDisplayed();
		this.display( this.getHelpText() );
	},

	bindEvents: function() {
		this.bindDOMEvent( this.getTarget(), 'keyup', this.onFieldChange, this );
		this.bindDOMEvent( this.getTarget(), 'focus', this.onFieldFocus, this );
		this.bindDOMEvent( this.getTarget(), 'blur', this.onFieldBlur, this );
		
		AFrame.Field.superclass.bindEvents.apply( this, arguments );
	},

	/**
	 * Get the help text to display in the field.  If not overridden, looks
	 * on the element for the value of the data-novalue-text attribute. 
	 * @method getHelpText
	 * @return {string}
	 */
	getHelpText: function() {
		var target = this.getTarget();
		return target.attr( 'data-novalue-text') || ''; 
	},
	
	/**
	 * Set the value of the field and display the value.  Sets the rest value to the value entered.
	 * @method set
	 * @param {variant} val value to display
	 */
	set: function( val ) {
		this.resetVal = val;
		
		val = val || this.getHelpText();
		this.display( val );
	},
	
	/**
	* Display a value, does not affect the reset value.  Using this function can be useful to
	*	change how a piece of data is visually represented on the screen.
	* @method display
	* @param {variant} val value to dipslay
	*/
	display: function( val ) {
		var target = this.getTarget();

		var func = val == this.getHelpText() ? 'addClass' : 'removeClass';
		target[ func ]( 'empty' );
		
		if( this.isValBased( target ) ) {
			target.val( val );
		}
		else {
			target.html( val );
		}
	},
	
	/**
	* Get the value that is displayed in the field.  This can be different from what get returns
	*	if the visual representation of the data is different from the data itself.
	* @method getDisplayed
	* @returns {string}
	*/
	getDisplayed: function() {
		var target = this.getTarget();
		var retval = '';
		if( this.isValBased( target ) ) {
			retval = target.val();
		}
		else {
			retval = target.html();
		}
		return retval;
	},

	/**
	 * Reset the field to its last 'set' value.
	 * @method reset
	 */
	reset: function() {
		this.set( this.resetVal );
	},

	/**
	 * Validate the field.  A field will validate if 1) Its form element does not have the required attribute, or 2) the field has a length.
	 *	sub classes can override this to perform more specific validation schemes.
	 * @method validate
	 * @return {boolean} true if field is valid, an object with two fields, error and field.
	 */
	validate: function() {
		var isRequired = ( 'true' == this.getTarget().attr( 'required' ) );
		var valid = ( !isRequired || !!this.get().length );
		if( !valid ) {
			valid = this.getErrorObject( 'Field is required' );
		}
		
		return valid;
	},
	
	/**
	* Get an error object
	* @method getErrorObject
	* @param {string} error - error message
	* @return {object} error object with two fields, error and field.
	*/
	getErrorObject: function( error ) {
		return {
			field: this,
			error: error
		};
	},
	
	/**
	 * Clear the field.  A reset after this will cause the field to go back to the blank state.
	 * @method clear
	 */
	clear: function() {
		this.set( '' );
	},
	
	/**
	 * Get the value of the field.  The value returned can be different if the visual representation is 
	 *	different from the underlying data.  Returns an empty string if no value entered.  
	 * @method get
	 * @return {variant} the value of the field
	 */
	get: function() {
		return this.resetVal;
	},
	
	/**
	 * Save the current value as a reset point
	 * @method save
	 */
	save: function() {
		var displayed = this.getDisplayed();
		if( displayed == this.getHelpText() ) {
			displayed = '';			
		}
		this.resetVal = displayed;
	},
	
	onFieldChange: function( event ) {
		/**
		* triggered whenever the field value changes
		* @event onChange
		* @param {string} fieldVal - the current field value.
		*/
		this.triggerEvent( 'onChange', this.get() );
	},
	
	onFieldFocus: function() {
		if( this.getDisplayed() == this.getHelpText() ) {
			this.display( '' );
		}
	},
	
	onFieldBlur: function() {
		if( '' === this.getDisplayed() ) {
			this.display( this.getHelpText() );
		}
	},
	
	isValBased: function( target ) {
		return target.is( 'input' ) || target.is( 'textarea' );
	}
} );