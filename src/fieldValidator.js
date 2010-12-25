
/**
* Takes care of form validation, using an HTML5 based FieldValidityState.  This needs filled out and refactored so 
*   that it doesn't call back to the field.
*
* @class AFrame.FieldValidator
* @static
*/
AFrame.FieldValidator = {
    /**
    * Get the current validity state for a field.
    *
    * var validityState = AFrame.FieldValidator.getValidityState( field );
    *
    * @method getValidityState
    * @param {AFrame.Field} field - the field to check
    * @return {AFrame.FieldValidityState} - the current validity state of the field.
    */
    getValidityState: function( field ) {
        var validityState = AFrame.FieldValidityState.getInstance( field.getTarget()[ 0 ].validity );
        return validityState;
    },
    
    /**
    * Validate a field.
    *
    * var isValid = AFrame.FieldValidator.validate( field );
    *
    * @method validate
    * @param {AFrame.Field} field - the field to check
    * @return {boolean} - whether the field is current valid
    */
    validate: function( field ) {
        var valid = true;
        var target = field.getTarget();
        
        var validator = target[ 0 ].checkValidity;
		if( validator ) {
			// browser supports native validation
			valid = validator();
		} else {
			var isRequired = target.hasAttr( 'required' );
			valid = ( !isRequired || !!field.get().length );
			
			if( !valid ) {
				field.setError( 'valueMissing' );
			}
		}    
        
        return valid;
    }
};



$.fn.hasAttr = function(name) {  
   return typeof( this.attr(name) ) != 'undefined';
};
