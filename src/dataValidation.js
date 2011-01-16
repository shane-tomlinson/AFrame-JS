/**
* Performs dataToValidate validation, attempts to follow the [HTML5 spec](http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#the-constraint-validation-api).
*
*    var criteria = {
*        min: 10,
*        type: 'number'
*    };
*
*    var fieldValidityState = AFrame.DataValidation.validate( {
*        data: 1,
*        criteria: criteria
*    } );  
*    // fieldValidityState.valid is false
*    // fieldValidityState.rangeUnderflow is true
*
*    fieldValidityState = AFrame.DataValidation.validate( {
*        data: 10,
*        criteria: criteria
*    } );  
*    // fieldValidityState.valid is true
*    // fieldValidityState.rangeUnderflow is false
*
*
*    // Add a custom validator
*
*    AFrame.DataValidation.setValidator( 'specializednumber', 'min', function( dataToValidate, 
*           fieldValidityState, thisCriteria, allCriteria ) {
*       // Do validation here.  If there is a problem, set the error on fieldValidityState
*       var valid = // code to do validation
*       if( !valid ) {
*           fieldValidationState.setCustomValidity( 'rangeUnderflow' );
*       }
*    } );
*
*    var criteria = {
*         min: 1234
*         type: 'specializednumber'
*    };
*            
*    var fieldValidityState = AFrame.DataValidation.validate( {
*        data: 1,
*        criteria: criteria
*    } );  
*                
*
* @class AFrame.DataValidation
* @static
*/
AFrame.DataValidation = ( function() {
    "use strict";
    
    var defined = AFrame.defined;
    var validationFuncs = {};
    var jsTypes = {
        text: 'string',
        number: 'number',
        integer: 'number'
    };
    
    var Validation = {
        
        /**
        * validate the dataToValidate using the given criteria.
        *
        *    var criteria = {
        *        min: 10,
        *        type: 'number'
        *    };
        *
        *    var fieldValidityState = AFrame.DataValidation.validate( {
        *        data: 1,
        *        criteria: criteria
        *    } );
        *    // fieldValidityState.valid is false
        *    // fieldValidityState.rangeUnderflow is true
        *
        *    fieldValidityState = AFrame.DataValidation.validate( {
        *        data: 10,
        *        criteria: criteria
        *    } ); 
        *    // fieldValidityState.valid is true
        *    // fieldValidityState.rangeUnderflow is false
        *
        * @method validate
        * @param {variant} options.data - dataToValidate to validate
        * @param {object} options.criteria - the criteria to validate against
        * @param {FieldValidityState} options.fieldValidityState (optional) - 
        *  field validity state to use, one is created if not given
        * @return {FieldValidityState} [FieldValidityState](AFrame.FieldValidityState.html) for the dataToValidate.
        */
        validate: function( options ) {
            var dataToValidate = options.data;
            var allCriteria = options.criteria;
            var fieldValidityState = options.fieldValidityState || AFrame.FieldValidityState.getInstance();
            var type = allCriteria.type || 'text';
            
            for( var key in allCriteria ) {
                this.validateDataForTypeCriteria( dataToValidate, type, key, fieldValidityState, allCriteria );
                this.validateDataForTypeCriteria( dataToValidate, 'all', key, fieldValidityState, allCriteria );
            }
            
            return fieldValidityState;
        },
        
        validateDataForTypeCriteria: function( dataToValidate, type, currCriteriaName, fieldValidityState, allCriteria ) {
            var validators = validationFuncs[ type ] || {};
            var validator = validators[ currCriteriaName ];
            if( validator ) {
                validator( dataToValidate, fieldValidityState, allCriteria[ currCriteriaName ], allCriteria );
            }
        },
        
        /**
        * Set a validator to be used for a certain type
        *
        *    AFrame.DataValidation.setValidator( 'specializednumber', 'min', function( dataToValidate, 
        *           fieldValidityState, thisCriteria, allCriteria ) {
        *       // Do validation here.  If there is a problem, set the error on fieldValidityState
        *       var valid = // code to do validation
        *       if( !valid ) {
        *           fieldValidationState.setError( 'rangeUnderflow' );
        *       }
        *    } );
        *
        *    var criteria = {
        *         min: 'criteria',
        *         type: 'specializednumber'
        *    };
        *            
        *    var fieldValidityState = AFrame.DataValidation.validate( {
        *        data: 1,
        *        criteria: criteria
        *    } );
        *                  
        * @method setValidator
        * @param {string} type - type of data to set validator for
        * @param {string} criteria - name of criteria to set validator for
        * @param {function} validator - the validator to use
        */
        setValidator: function( type, criteria, validator ) {
            validationFuncs[ type ] = validationFuncs[ type ] || {};
            validationFuncs[ type ][ criteria ] = validator;
        }
    };

    Validation.setValidator( 'all', 'required', function( dataToValidate, fieldValidityState ) {
        if( !defined( dataToValidate ) ) {
            fieldValidityState.setError( 'valueMissing' );
        }
    } );
        
    Validation.setValidator( 'all', 'type', function( dataToValidate, fieldValidityState, type ) {
        if( defined( dataToValidate ) ) {            
            var jsType = jsTypes[ type ];
            
            if( jsType && jsType != typeof( dataToValidate ) ) {
                fieldValidityState.setError( 'typeMismatch' );
            }
        }
    
    } );
    
    var numberMinValidation = function( dataToValidate, fieldValidityState, min ) {
        if( defined( dataToValidate ) && ( dataToValidate < min ) ) {
            fieldValidityState.setError( 'rangeUnderflow' );
        }
    };
    
    Validation.setValidator( 'number', 'min', numberMinValidation );
    Validation.setValidator( 'integer', 'min', numberMinValidation );

    var numberMaxValidation = function( dataToValidate, fieldValidityState, max ) {
        if( defined( dataToValidate ) && ( dataToValidate > max ) ) {
            fieldValidityState.setError( 'rangeOverflow' );
        }
    };    
    Validation.setValidator( 'number', 'max', numberMaxValidation );
    Validation.setValidator( 'integer', 'max', numberMaxValidation );
        
    var numberStepValidation = function( dataToValidate, fieldValidityState, step, allCriteria ) {
        if( defined( dataToValidate ) ) {
            var min = allCriteria.min || 0;
            var valid = 0 === ( ( dataToValidate - min ) % step );
            if( !valid ) {
                fieldValidityState.setError( 'stepMismatch' );
            }
        }
    };
    
    Validation.setValidator( 'number', 'step', numberStepValidation );
    Validation.setValidator( 'integer', 'step', numberStepValidation );
        
    Validation.setValidator( 'text', 'maxlength', function( dataToValidate, fieldValidityState, maxLength ) {
        if( defined( dataToValidate ) && dataToValidate.length && dataToValidate.length > maxLength ) {
            fieldValidityState.setError( 'tooLong' );
        }
    } );
        
    Validation.setValidator( 'text', 'pattern', function( dataToValidate, fieldValidityState, pattern ) {
        var regexp = new RegExp( pattern );
        if( defined( dataToValidate ) && !regexp.test( dataToValidate ) ) {
            fieldValidityState.setError( 'patternMismatch' );
        }
    } );
    
    
    return Validation;

})();
