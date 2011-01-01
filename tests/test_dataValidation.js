testsToRun.push( function testAObject( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	
	var testAObject = new TestCase( {
		
		name: "TestCase AFrame.DataValidation",
		
        testRequired: function() {
            var criteria = {
                required: true
            };
            
            var fieldValidityState = AFrame.DataValidation.validate( 
                undefined, criteria );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.valueMissing, 'field is invalid' );
            
            fieldValidityState = AFrame.DataValidation.validate( 
                criteria, 1 );
            
            Assert.isTrue( fieldValidityState.valid, 'field is invalid' );
            Assert.isFalse( fieldValidityState.valueMissing, 'field is invalid' );
            
        },
        
        testMin: function() {
            var criteria = {
                min: 10
            };

            var fieldValidityState = AFrame.DataValidation.validate( 
                1, criteria );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.rangeUnderflow, 'value is too low' );

            fieldValidityState = AFrame.DataValidation.validate( 
                10, criteria );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.rangeUnderflow, 'value is good' );

            fieldValidityState = AFrame.DataValidation.validate( 
                100, criteria );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.rangeUnderflow, 'value is good' );
        },
        
        testMax: function() {
            var criteria = {
                max: 10
            };

            var fieldValidityState = AFrame.DataValidation.validate( 
                100, criteria );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.rangeOverflow, 'value is too high' );

            fieldValidityState = AFrame.DataValidation.validate( 
                10, criteria );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.rangeOverflow, 'value is good' );

            fieldValidityState = AFrame.DataValidation.validate( 
                1, criteria );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.rangeOverflow, 'value is good' );
        },
        
        testMaxLength: function() {
            var criteria = {
                maxlength: 10
            };

            var fieldValidityState = AFrame.DataValidation.validate( 
                '', criteria );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.tooLong, 'value is ok length' );

            fieldValidityState = AFrame.DataValidation.validate( 
                '1234567890', criteria );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.tooLong, 'value is ok length' );

            fieldValidityState = AFrame.DataValidation.validate( 
                '12345678901', criteria );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.tooLong, 'value is too long' );
        },
        
        testPattern: function() {
            var criteria = {
                pattern: '[0-9][A-Z]{3}'
            };

            var fieldValidityState = AFrame.DataValidation.validate( 
                '', criteria );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.patternMismatch, 'pattern does not match' );

            fieldValidityState = AFrame.DataValidation.validate( 
                '0ABC', criteria );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.patternMismatch, 'pattern matches' );
        },
        
        testStep: function() {
            var criteria = {
                step: 2
            };
            
            // step, no min, should use 0 as the min.
            var fieldValidityState = AFrame.DataValidation.validate( 
                .33, criteria );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.stepMismatch, '.33 is an invalid step' );

            // step, no min, should use 0 as the min.
            fieldValidityState = AFrame.DataValidation.validate( 
                2, criteria );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.stepMismatch, '2 is a valid step' );
            
            // Add a non-standard min to see if it works.
            criteria.min = 3;

            fieldValidityState = AFrame.DataValidation.validate( 
                3, criteria );
            
            Assert.isTrue( fieldValidityState.valid, '3 is valid' );
            Assert.isFalse( fieldValidityState.stepMismatch, '3 is a valid step when .33 is min' );

            // step, with min
            fieldValidityState = AFrame.DataValidation.validate( 
                5, criteria );

            Assert.isTrue( fieldValidityState.valid, '5 is valid' );
            Assert.isFalse( fieldValidityState.stepMismatch, '5 is a valid step when .33 is min' );

            // step, with min
            fieldValidityState = AFrame.DataValidation.validate( 
                4, criteria );

            Assert.isFalse( fieldValidityState.valid, '4 is an invalid step' );
            Assert.isTrue( fieldValidityState.stepMismatch, '4 is an invalid step when 3 is min' );
        },
        
        testType: function() {
            var criteria = {
                type: 'text'
            };

            var fieldValidityState = AFrame.DataValidation.validate( 
                1, criteria );
            
            Assert.isFalse( fieldValidityState.valid, 'text field is invalid' );
            Assert.isTrue( fieldValidityState.typeMismatch, '1 is not text' );

            
            var fieldValidityState = AFrame.DataValidation.validate( 
                'asdf', criteria );
            
            Assert.isTrue( fieldValidityState.valid, 'text field is valid' );
            Assert.isFalse( fieldValidityState.typeMismatch, 'asdf is text' );

            var criteria = {
                type: 'number'
            };

            var fieldValidityState = AFrame.DataValidation.validate( 
                1, criteria );
            
            Assert.isTrue( fieldValidityState.valid, 'number field is valid' );
            Assert.isFalse( fieldValidityState.typeMismatch, '1 is a number' );

            var fieldValidityState = AFrame.DataValidation.validate( 
                'asdf', criteria );
            
            Assert.isFalse( fieldValidityState.valid, 'number field is invalid' );
            Assert.isTrue( fieldValidityState.typeMismatch, 'asdf is not a number' );

            var fieldValidityState = AFrame.DataValidation.validate( 
                '1', criteria );
            
            Assert.isFalse( fieldValidityState.valid, 'number field is invalid' );
            Assert.isTrue( fieldValidityState.typeMismatch, "'1' is not a number" );
        },
        
        testSetCustomValidator: function() {
            var validator = function( data, fieldValidityState, criteria, allCriteria ) {
                fieldValidityState.setCustomValidity( 'randomValidationError' );
            };
            
            AFrame.DataValidation.setValidator( 'randomtype', validator );
            
            var criteria = {
                randomtype: 'criteria'
            };
            
            var fieldValidityState = AFrame.DataValidation.validate( 
                1, criteria );
                
            
            Assert.isFalse( fieldValidityState.valid, 'randomValidationError caused invalid field' );
            Assert.isTrue( fieldValidityState.customError, 'randomValidationError caused customError' );
            Assert.areEqual( 'randomValidationError', fieldValidityState.validationMessage, 'randomValidationError set for validationMessage' );
        }
	
	} );

	TestRunner.add( testAObject );
	
} );