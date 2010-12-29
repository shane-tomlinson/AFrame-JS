/**
* Performs data validation, follows the HTML5 spec.
* @class AFrame.DataValidation
* @static
*/
AFrame.DataValidation = {
    /**
    * validate the data using the given validators
    * @method validate
    * @param {variant} data - data to validate
    * @param {object} validators - validators to use
    * @param {AFrame.FieldValidityState} fieldValidityState (optional) - 
    *  field validity state to use, one is created if not given
    * @return {AFrame.FieldValidityState} [FieldValidityState](AFrame.FieldValidityState.html) for the data.
    */
    validate: function( data, validators, fieldValidityState ) {
        fieldValidityState = fieldValidityState || AFrame.FieldValidityState.getInstance();
        
        var defined = AFrame.defined( data );
        
        for( var key in validators ) {
            switch( key ) {
                case 'required':
                    if( !defined ) {
                        fieldValidityState.setError( 'valueMissing' );
                    }
                    break;
                case 'min':
                    if( defined && ( data < validators[ key ] ) ) {
                        fieldValidityState.setError( 'rangeUnderflow' );
                    }
                    break;
                case 'max':
                    if( defined && ( data > validators[ key ] ) ) {
                        fieldValidityState.setError( 'rangeOverflow' );
                    }
                    break;
                case 'maxlength':
                    if( defined && data.length && data.length > validators[ key ] ) {
                        fieldValidityState.setError( 'tooLong' );
                    }
                    break;
                case 'pattern':
                    var regexp = new RegExp( validators[ key ] );
                    if( defined && !regexp.test( data ) ) {
                        fieldValidityState.setError( 'patternMismatch' );
                    }
                    break;
                default:
                    break;
            }
        }
        
        return fieldValidityState;
    }
};