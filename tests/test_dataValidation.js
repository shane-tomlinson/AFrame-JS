testsToRun.push( function testAObject( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	
	var testAObject = new TestCase( {
		
		name: "TestCase AFrame.DataValidation",
		
        testRequired: function() {
            var validators = {
                required: true
            };
            
            var fieldValidityState = AFrame.DataValidation.validate( 
                undefined, validators );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.valueMissing, 'field is invalid' );
            
            fieldValidityState = AFrame.DataValidation.validate( 
                validators, 1 );
            
            Assert.isTrue( fieldValidityState.valid, 'field is invalid' );
            Assert.isFalse( fieldValidityState.valueMissing, 'field is invalid' );
            
        },
        
        testMin: function() {
            var validators = {
                min: 10
            };

            var fieldValidityState = AFrame.DataValidation.validate( 
                1, validators );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.rangeUnderflow, 'value is too low' );

            fieldValidityState = AFrame.DataValidation.validate( 
                10, validators );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.rangeUnderflow, 'value is good' );

            fieldValidityState = AFrame.DataValidation.validate( 
                100, validators );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.rangeUnderflow, 'value is good' );
        },
        
        testMax: function() {
            var validators = {
                max: 10
            };

            var fieldValidityState = AFrame.DataValidation.validate( 
                100, validators );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.rangeOverflow, 'value is too high' );

            fieldValidityState = AFrame.DataValidation.validate( 
                10, validators );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.rangeOverflow, 'value is good' );

            fieldValidityState = AFrame.DataValidation.validate( 
                1, validators );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.rangeOverflow, 'value is good' );
        },
        
        testMaxLength: function() {
            var validators = {
                maxlength: 10
            };

            var fieldValidityState = AFrame.DataValidation.validate( 
                '', validators );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.tooLong, 'value is ok length' );

            fieldValidityState = AFrame.DataValidation.validate( 
                '1234567890', validators );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.tooLong, 'value is ok length' );

            fieldValidityState = AFrame.DataValidation.validate( 
                '12345678901', validators );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.tooLong, 'value is too long' );
        },
        
        testPattern: function() {
            var validators = {
                pattern: '[0-9][A-Z]{3}'
            };

            var fieldValidityState = AFrame.DataValidation.validate( 
                '', validators );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.patternMismatch, 'pattern does not match' );

            fieldValidityState = AFrame.DataValidation.validate( 
                '0ABC', validators );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.patternMismatch, 'pattern matches' );
        },
        
        testStep: function() {
            var validators = {
                step: 2
            };
            
            // step, no min, should use 0 as the min.
            var fieldValidityState = AFrame.DataValidation.validate( 
                .33, validators );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.stepMismatch, '.33 is an invalid step' );

            // step, no min, should use 0 as the min.
            fieldValidityState = AFrame.DataValidation.validate( 
                2, validators );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.stepMismatch, '2 is a valid step' );
            
            // Add a non-standard min to see if it works.
            validators.min = 3;

            fieldValidityState = AFrame.DataValidation.validate( 
                3, validators );
            
            Assert.isTrue( fieldValidityState.valid, '3 is valid' );
            Assert.isFalse( fieldValidityState.stepMismatch, '3 is a valid step when .33 is min' );

            // step, with min
            fieldValidityState = AFrame.DataValidation.validate( 
                5, validators );

            Assert.isTrue( fieldValidityState.valid, '5 is valid' );
            Assert.isFalse( fieldValidityState.stepMismatch, '5 is a valid step when .33 is min' );

            // step, with min
            fieldValidityState = AFrame.DataValidation.validate( 
                4, validators );

            Assert.isFalse( fieldValidityState.valid, '4 is an invalid step' );
            Assert.isTrue( fieldValidityState.stepMismatch, '4 is an invalid step when 3 is min' );
        },
        
        testType: function() {
            var validators = {
                type: 'text'
            };

            var fieldValidityState = AFrame.DataValidation.validate( 
                1, validators );
            
            Assert.isFalse( fieldValidityState.valid, 'text field is invalid' );
            Assert.isTrue( fieldValidityState.typeMismatch, '1 is not text' );

            
            var fieldValidityState = AFrame.DataValidation.validate( 
                'asdf', validators );
            
            Assert.isTrue( fieldValidityState.valid, 'text field is valid' );
            Assert.isFalse( fieldValidityState.typeMismatch, 'asdf is text' );

            var validators = {
                type: 'number'
            };

            var fieldValidityState = AFrame.DataValidation.validate( 
                1, validators );
            
            Assert.isTrue( fieldValidityState.valid, 'number field is valid' );
            Assert.isFalse( fieldValidityState.typeMismatch, '1 is a number' );

            var fieldValidityState = AFrame.DataValidation.validate( 
                'asdf', validators );
            
            Assert.isFalse( fieldValidityState.valid, 'number field is invalid' );
            Assert.isTrue( fieldValidityState.typeMismatch, 'asdf is not a number' );

            var fieldValidityState = AFrame.DataValidation.validate( 
                '1', validators );
            
            Assert.isFalse( fieldValidityState.valid, 'number field is invalid' );
            Assert.isTrue( fieldValidityState.typeMismatch, "'1' is not a number" );
        }
	
	} );

	TestRunner.add( testAObject );
	
} );