/**
* Performs dataToValidate validation, attempts to follow the [HTML5 spec](http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#the-constraint-validation-api).
* @class AFrame.DataValidation
* @static
*/
AFrame.DataValidation = (function() {
    var defined = AFrame.defined;
    var validationFuncs = {
        required: function( dataToValidate, fieldValidityState ) {
            if( !defined( dataToValidate ) ) {
                fieldValidityState.setError( 'valueMissing' );
            }
        },
        
        type: function( dataToValidate, fieldValidityState, type ) {
            if( defined( dataToValidate ) ) {
                var jsTypes = {
                    text: 'string',
                    number: 'number'
                };
                
                var jsType = jsTypes[ type ];
                
                if( jsType != typeof( dataToValidate ) ) {
                    fieldValidityState.setError( 'typeMismatch' );
                }
            }
        
        },
        
        min: function( dataToValidate, fieldValidityState, min ) {
            if( defined( dataToValidate ) && ( dataToValidate < min ) ) {
                fieldValidityState.setError( 'rangeUnderflow' );
            }
        },
        
        max: function( dataToValidate, fieldValidityState, max ) {
            if( defined( dataToValidate ) && ( dataToValidate > max ) ) {
                fieldValidityState.setError( 'rangeOverflow' );
            }
        },
        
        step: function( dataToValidate, fieldValidityState, step, allCriteria ) {
            if( defined( dataToValidate ) ) {
                var min = allCriteria.min || 0;
                var valid = 0 === ( ( dataToValidate - min ) % step );
                if( !valid ) {
                    fieldValidityState.setError( 'stepMismatch' );
                }
            }
        },
        
        maxlength: function( dataToValidate, fieldValidityState, maxLength ) {
            if( defined( dataToValidate ) && dataToValidate.length && dataToValidate.length > maxLength ) {
                fieldValidityState.setError( 'tooLong' );
            }
        },
        
        pattern: function( dataToValidate, fieldValidityState, pattern ) {
            var regexp = new RegExp( pattern );
            if( defined( dataToValidate ) && !regexp.test( dataToValidate ) ) {
                fieldValidityState.setError( 'patternMismatch' );
            }
        }
    };
    
    var Validation = {
        
        /**
        * validate the dataToValidate using the given validators.
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
        * @param {variant} dataToValidate - dataToValidate to validate
        * @param {object} validators - validators to use
        * @param {FieldValidityState} fieldValidityState (optional) - 
        *  field validity state to use, one is created if not given
        * @return {FieldValidityState} [FieldValidityState](AFrame.FieldValidityState.html) for the dataToValidate.
        */
        validate: function( dataToValidate, criteria, fieldValidityState ) {
            fieldValidityState = fieldValidityState || AFrame.FieldValidityState.getInstance();
            
            for( var key in criteria ) {
                var validator = validationFuncs[ key ];
                if( validator ) {
                    validator( dataToValidate, fieldValidityState, criteria[ key ], criteria );
                }
            }
            
            return fieldValidityState;
        },
        
        /**
        * Set a validator to be used for a certain type
        *
        *    AFrame.DataValidation.addValidator( 'randomtype', function( dataToValidate, fieldValidityState, criteria, otherValidators ) {
        *       // Do validation here.  If there is a problem, set the error on fieldValidityState
        *       var valid = // code to do validation
        *       if( !valid ) {
        *           fieldValidationState.setCustomValidity( 'invalidRandomType' );
        *       }
        *    } );
        *
        * @method setValidator
        * @param {string} type - type to set validator for
        * @param {function} validator - the validator to use
        */
        setValidator: function( type, validator ) {
            validationFuncs[ type ] = validator;
        }
    };
    
    return Validation;

})();
