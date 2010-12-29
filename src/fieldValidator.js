
/**
* Takes care of validation for a [Field](AFrame.Field.html), using an HTML5 based 
* [FieldValidityState](AFrame.FieldValidityState.html).
*
* @class AFrame.FieldValidator
* @extends AFrame.AObject
* @constructor
*/
AFrame.FieldValidator = function() {
    AFrame.FieldValidator.superclass.constructor.call( this );
};
AFrame.extend( AFrame.FieldValidator, AFrame.AObject, {
    init: function( config ) {
        /**
        * The AFrame.Field to validate.  If not specified, setField must be called before any
        *   validation can occur.
        * @config field
        * @type {AFrame.Field} (optional)
        */
        if( config.field ) {
            this.setField( config.field );
        }
        
        AFrame.FieldValidator.superclass.init.call( this, config );
    },
    
    /**
    * set the field
    *
    *     validator.setField( field );
    *
    * @method setField
    * @param {AFrame.Field} field - field to check against
    */
    setField: function( field ) {
        this.field = field;
        this.calculateValidity = true;
        this.field.bindEvent( 'onChange', this.onChange, this );
    },
    
    onChange: function() {
        this.calculateValidity = true;
    },
    
    /**
    * Get the current validity state for a field.
    *
    *     var validityState = validator.getValidityState( field );
    *
    * @method getValidityState
    * @return {AFrame.FieldValidityState} - the current validity state of the field.
    */
    getValidityState: function() {
        this.updateValidityState( true );
        return this.validityState;
    },
    
    /**
    * Validate a field.
    *
    *     var isValid = validator.validate( field );
    *
    * @method validate
    * @return {boolean} - whether the field is current valid
    */
    validate: function() {
        this.updateValidityState( false );
        
        var field = this.field;
        var valid = true;
        var target = field.getTarget();
        
		if( target[ 0 ].checkValidity ) {
			// browser supports native validation
			valid = target[ 0 ].checkValidity();
		} else {
            var validators = this.getValidators();
            var val = field.get();
            val = val.length ? val : undefined;
            
            AFrame.DataValidation.validate( val, validators, this.validityState );
            valid = this.validityState.valid;
		}    
        
        return valid;
    },
    
    /**
    * Update the field's validity state.
    * @private
    * @method updateValidityState
    * @param {boolean} validate - whether to perform actual validation or not
    */
    updateValidityState: function( validate ) {
        var field = this.field;
        
        if( this.calculateValidity ) {
            this.validityState = AFrame.FieldValidityState.getInstance( field.getTarget()[ 0 ].validity );

            if( validate ) {
                this.validate();
            }
            
            this.calculateValidity = false;
        }
    },
    
	/**
	* Set an error.  See [AFrame.FieldValidityState](AFrame.FieldValidityState.html)
    *
    *   validator.setError( 'valueMissing' );
    *
	* @method setError
	* @param {string} errorType
	*/
    setError: function( error ) {
        return this.validityState.setError( error );
    },
    
	/**
	* Set a custom error.  In the AFrame.FieldValidityState object returned
	*	by getValidityState, a custom error will have the customError field set to this 
	*	message
    *
    *   validator.setCustomValidity( 'Names must start with a letter' );
    *
	* @method setCustomValidity
	* @param {string} customError - the error message to display
	*/
    setCustomValidity: function( customValidity ) {
        return this.validityState.setCustomValidity( customValidity );
    },
    
    /**
    * Get the field's validators
    * @method getValidators
    * @return {object} validators for the field
    * @private
    */
    getValidators: function() {
        var target = this.field.getTarget();
        var validators = {};
        
        if( target.hasAttr( 'required' ) ) {
            validators.required = true;
        }
        
        return validators;
    }
} );

$.fn.hasAttr = function(name) {  
   return typeof( this.attr(name) ) != 'undefined';
};
