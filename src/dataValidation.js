/**
* Performs data validation, attempts to follow the [HTML5 spec](http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#the-constraint-validation-api).
* @class AFrame.DataValidation
* @static
*/
AFrame.DataValidation = (function() {
    var defined = AFrame.defined;
    var validationFuncs = {
        required: function( data, fieldValidityState ) {
            if( !defined( data ) ) {
                fieldValidityState.setError( 'valueMissing' );
            }
        },
        
        type: function( data, fieldValidityState, type ) {
            if( defined( data ) ) {
                var jsTypes = {
                    text: 'string',
                    number: 'number'
                };
                
                var jsType = jsTypes[ type ];
                
                if( jsType != typeof( data ) ) {
                    fieldValidityState.setError( 'typeMismatch' );
                }
            }
        
        },
        
        min: function( data, fieldValidityState, min ) {
            if( defined( data ) && ( data < min ) ) {
                fieldValidityState.setError( 'rangeUnderflow' );
            }
        },
        
        max: function( data, fieldValidityState, max ) {
            if( defined( data ) && ( data > max ) ) {
                fieldValidityState.setError( 'rangeOverflow' );
            }
        },
        
        step: function( data, fieldValidityState, step, validators ) {
            if( defined( data ) ) {
                var min = validators.min || 0;
                var valid = 0 === ( ( data - min ) % step );
                if( !valid ) {
                    fieldValidityState.setError( 'stepMismatch' );
                }
            }
        },
        
        maxlength: function( data, fieldValidityState, maxLength ) {
            if( defined( data ) && data.length && data.length > maxLength ) {
                fieldValidityState.setError( 'tooLong' );
            }
        },
        
        pattern: function( data, fieldValidityState, pattern ) {
            var regexp = new RegExp( pattern );
            if( defined( data ) && !regexp.test( data ) ) {
                fieldValidityState.setError( 'patternMismatch' );
            }
        }
    };
    
    var Validation = {
        
        /**
        * validate the data using the given validators.
        *
        *    var validators = {
        *        min: 10
        *    };
        *
        *    var fieldValidityState = AFrame.DataValidation.validate( 
        *        1, validators );
        *    // fieldValidityState.valid is false
        *    // fieldValidityState.rangeUnderflow is true
        *
        *    fieldValidityState = AFrame.DataValidation.validate( 
        *        10, validators );
        *    // fieldValidityState.valid is true
        *    // fieldValidityState.rangeUnderflow is false
        *
        * @method validate
        * @param {variant} data - data to validate
        * @param {object} validators - validators to use
        * @param {FieldValidityState} fieldValidityState (optional) - 
        *  field validity state to use, one is created if not given
        * @return {FieldValidityState} [FieldValidityState](AFrame.FieldValidityState.html) for the data.
        */
        validate: function( data, validators, fieldValidityState ) {
            fieldValidityState = fieldValidityState || AFrame.FieldValidityState.getInstance();
            
            for( var key in validators ) {
                var validator = validationFuncs[ key ];
                if( validator ) {
                    validator( data, fieldValidityState, validators[ key ], validators );
                }
            }
            
            return fieldValidityState;
        }
    };
    
    return Validation;

})();
