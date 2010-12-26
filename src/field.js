/**
 * The base class for a field.  A field is a basic unit for a form.  With the new HTML5 spec,
 * each form field has an invalid event.  Some browsers display an error message whenever the
 * invalid event is triggered.  If custom error message processing is desired, set 
 * AFrame.Field.cancelInvalid = false and the default action will be prevented and no browser error.
 * Field validation does not occur in real time, for validation to occur, the checkValidity
 * function must be called.
 *
 *    <input type="number" id="numberInput" />
 *   
 *    ---------
 *
 *    var field = AFrame.construct( {
 *       type: AFrame.Field,
 *       config: {
 *           target: $( '#numberInput' )
 *       }
 *    } );
 *   
 *    // Set the value of the field, it is now displaying 3.1415
 *    field.set(3.1415);
 *   
 *    // Check the validity of the field
 *    var isValid = field.checkValidity();
 *   
 *    // The field is cleared, displays nothing
 *    field.clear();
 *   
 *    field.set('invalid set');
 *   
 *    // This will return false
 *    isValid = field.checkValidity();
 *   
 *    // Get the validity state, as per the HTML5 spec
 *    var validityState = field.getValidityState();
 *
 * @class AFrame.Field
 * @extends AFrame.Display
 * @constructor
 */
AFrame.Field = function() {
	AFrame.Field.superclass.constructor.apply( this, arguments );
};
AFrame.Field.cancelInvalid = false;
AFrame.extend( AFrame.Field, AFrame.Display, {
	init: function( config ) {
		AFrame.Field.superclass.init.apply( this, arguments );

		this.resetVal = this.getDisplayed();
        
        this.fieldValidator = config.fieldValidator || this.createValidator();
        
        if( config.fieldValidator ) {
            this.fieldValidator.setField( this );
        }
	},
    
    createValidator: function() {
        var fieldValidator = AFrame.construct( {
            type: AFrame.FieldValidator,
            config: {
                field: this
            }
        } );
        
        return fieldValidator;
    },

	bindEvents: function() {
		var target = this.getTarget();
		this.bindDOMEvent( target, 'keyup', this.onFieldChange, this );
		this.bindDOMEvent( target, 'invalid', this.onFieldInvalid, this );
		
		AFrame.Field.superclass.bindEvents.apply( this, arguments );
	},

	/**
	 * Set the value of the field and display the value.  Sets the rest value to the value entered.
     * 
     *    nameField.set( 'AFrame' );
     *
	 * @method set
	 * @param {variant} val value to display
	 */
	set: function( val ) {
		this.resetVal = val;
        this.display( val );
        this.onFieldChange();
	},
	
	/**
	* Display a value, does not affect the reset value.  Using this function can be useful to
	*	change how a piece of data is visually represented on the screen.
    *
    *    nameField.display( 'AFrame' );
    *
	* @method display
	* @param {variant} val value to dipslay
	*/
	display: function( val ) {
		var target = this.getTarget();

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
    *
    *    var displayed = nameField.getDisplayed();
    *    console.log( 'displayedValue: ' + displayed );
    *
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
     *
     *    nameField.reset();
     *
	 * @method reset
	 */
	reset: function() {
		this.set( this.resetVal );
	},

	/**
	 * Validate the field.  A field will validate if 1) Its form element does not have the required 
     * attribute, or 2) the field has a length.  Sub classes can override this to perform more 
     * specific validation schemes.  The HTML5 spec specifies checkValidity as the method to use 
     * to check the validity of a form field.  Calling this will reset any validation errors 
     * previously set and start with a new state.
     *
     *    var isValid = nameField.checkValidity();
     *
	 * @method checkValidity
	 * @return {boolean} true if field is valid, false otw.
	 */
	checkValidity: function() {
		var valid = this.validate();

		return valid;
	},
	
	/**
	* This should not be called directly, instead [checkValidity](#method_checkValidity) should be.
    * Do the actual validation on the field.  Should be overridden to do validations.
    *
    *   var isValid = nameField.validate();
    *
	* @method validate
	* @return {boolean} true if field is valid, false otw.
	*/
	validate: function() {
		var valid = this.fieldValidator.validate();
		return valid;
	},
	
	/**
	* Get the current validity status of an object.
    *
    *    var validityState = nameField.getValidityState();
    *    // do something with the validityState
    *
	* @method getValidityState
	* @return {AFrame.FieldValidityState}
	*/
	getValidityState: function() {
		return this.fieldValidator.getValidityState();
	},
	
	/**
	* Set an error on the field.  See [AFrame.FieldValidityState](AFrame.FieldValidityState.html)
    *
    *   nameField.setError( 'valueMissing' );
    *
	* @method setError
	* @param {string} errorType
	*/
	setError: function( errorType ) {
		this.fieldValidator.setError( errorType );
	},
	
	/**
	* Set a custom error on the field.  In the AFrame.FieldValidityState object returned
	*	by getValidityState, a custom error will have the customError field set to this 
	*	message
    *
    *   nameField.setCustomValidity( 'Names must start with a letter' );
    *
	* @method setCustomValidity
	* @param {string} customError - the error message to display
	*/
	setCustomValidity: function( customError ) {
		this.fieldValidator.setCustomValidity( customError );
	},
	
	/**
	 * Clear the field.  A reset after this will cause the field to go back to the blank state.
     *
     *    nameField.clear();
     *
	 * @method clear
	 */
	clear: function() {
		this.set( '' );
	},
	
	/**
	 * Get the value of the field.  The value returned can be different if the visual representation is 
	 *	different from the underlying data.  Returns an empty string if no value entered.  
     *
     *    var val = nameField.get();
     *
	 * @method get
	 * @return {variant} the value of the field
	 */
	 
	get: function() {
		return this.resetVal;
	},
	
	/**
	 * Save the current value as a reset point
     *
     *    nameField.save();
     *
	 * @method save
	 */
	save: function() {
		var displayed = this.getDisplayed();
		
		this.resetVal = displayed;
	},
	
	onFieldChange: function() {
		/**
		* triggered whenever the field value changes
		* @event onChange
		* @param {string} fieldVal - the current field value.
		*/
		this.triggerEvent( 'onChange', this, this.get() );
	},

	onFieldInvalid: function( event ) {
		if( AFrame.Field.cancelInvalid ) {
			event.preventDefault();
		}
	},
	
	isValBased: function( target ) {
		return target.is( 'input' ) || target.is( 'textarea' );
	}
} );
