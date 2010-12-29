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

            fieldValidityState = AFrame.DataValidation.validate( 
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

            fieldValidityState = AFrame.DataValidation.validate( 
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

            fieldValidityState = AFrame.DataValidation.validate( 
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

            fieldValidityState = AFrame.DataValidation.validate( 
                '', validators );
            
            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.patternMismatch, 'pattern does not match' );

            fieldValidityState = AFrame.DataValidation.validate( 
                '0ABC', validators );
            
            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.patternMismatch, 'pattern matches' );


        }
	
	} );

	TestRunner.add( testAObject );
	
} );