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
		this.display( this.getPlaceholder() );
		
		this.html5Validate = !!this.getTarget()[ 0 ].checkValidity;
	},

	bindEvents: function() {
		this.bindDOMEvent( this.getTarget(), 'keyup', this.onFieldChange, this );
		this.bindDOMEvent( this.getTarget(), 'focus', this.onFieldFocus, this );
		this.bindDOMEvent( this.getTarget(), 'blur', this.onFieldBlur, this );
		
		AFrame.Field.superclass.bindEvents.apply( this, arguments );
	},

	/**
	 * Get the placeholder text to display in the field.  If not overridden, looks
	 * on the element for the value of the placeholder attribute. 
	 * @method getPlaceholder
	 * @return {string}
	 */
	getPlaceholder: function() {
		var target = this.getTarget();
		return target.attr( 'placeholder' ) || ''; 
	},
	
	/**
	 * Set the value of the field and display the value.  Sets the rest value to the value entered.
	 * @method set
	 * @param {variant} val value to display
	 */
	set: function( val ) {
		this.resetVal = val;
		
		val = val || this.getPlaceholder();
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

		var func = val == this.getPlaceholder() ? 'addClass' : 'removeClass';
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
	 * @method checkValidity
	 * @return {boolean} true if field is valid, false otw.
	 */
	checkValidity: function() {
		this.validityState = AFrame.FieldValidityState.getInstance( this.getTarget()[ 0 ].validity );

		var valid = this.validate();		
		this.validityStateIsCurrent = true;
		return valid;
	},
	
	/**
	* Do the actual validation on the field.  Should be overridden to do validations.  Calling this will
	*	reset any validation errors previously set and start with a new state.
	* @method validate
	*/
	validate: function() {
		var valid = true;
		
		if( this.html5Validate ) {
			// browser supports native validity
			valid = this.getTarget()[ 0 ].checkValidity();
		} else {
			var isRequired = this.getTarget().hasAttr( 'required' );
			valid = ( !isRequired || !!this.get().length );
			
			if( !valid ) {
				this.setError( 'valueMissing' );
			}
		}
		
		return valid;
	},
	
	/**
	* Get the current validity status of an object.
	* @method getValidityState
	* @return {AFrame.FieldValidityState}
	*/
	getValidityState: function() {
		if( !this.validityStateIsCurrent ) {
			this.checkValidity();
		}
		
		return this.validityState;
	},
	
	/**
	* Set an error on the field.
	* @setError
	* @param {string} errorType - @see AFrame.FieldValidityState
	*/
	setError: function( errorType ) {
		this.validityState.setError( errorType );
	},
	
	/**
	* Set a custom error on the field.  In the AFrame.FieldValidityState object returned
	*	by getValidityState, a custom error will have the customError field set to this 
	*	message
	* @method setCustomError
	* @param {string} customError - the error message to display
	*/
	setCustomError: function( customError ) {
		this.validityState.setCustomError( customError );
	},
	
	/**
	* Get an error object
	* @method getErrorObject
	* @param {string} error - error message
	* @return {object} error object with two fields, error and field.
	*//*
	getErrorObject: function( error ) {
		return {
			field: this,
			error: error
		};
	},
	*/
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
		if( displayed == this.getPlaceholder() ) {
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
		
		this.validityStateIsCurrent = false;
	},
	
	onFieldFocus: function() {
		if( this.getDisplayed() == this.getPlaceholder() ) {
			this.display( '' );
		}
	},
	
	onFieldBlur: function() {
		if( '' === this.getDisplayed() ) {
			this.display( this.getPlaceholder() );
		}
	},
	
	isValBased: function( target ) {
		return target.is( 'input' ) || target.is( 'textarea' );
	}
} );

$.fn.hasAttr = function(name) {  
   return typeof( this.attr(name) ) != 'undefined';
};
