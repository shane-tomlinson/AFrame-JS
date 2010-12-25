testsToRun.push( function testField( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.FieldValidator",
		
		setUp: function() {
			target = $( 'textarea[data-field=name]' );
			
			this.field = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: target
				}
			} );
            
        },
        tearDown: function() {
            this.field.teardown();
            this.field = null;
        },
        
        testGetValidityState: function() {
            var validityState = AFrame.FieldValidator.getValidityState( this.field );
            Assert.isTrue( validityState instanceof AFrame.FieldValidityState, 'getValidityState returns a FieldValidityState' );
        },
        
        testValidateValueMissing: function() {
            this.field.set( 'value' );
            var isValid = AFrame.FieldValidator.validate( this.field );
            
            Assert.isTrue( isValid, 'field is currently valid' );

            this.field.set( '' );
            isValid = AFrame.FieldValidator.validate( this.field );
            
            Assert.isFalse( isValid, 'field is invalid, missing value' );
            
      //      var validityState = AFrame.FieldValidator.getValidityState( this.field );
      //      Assert.isTrue( validityState.valueMissing, 'valueMissing set to true' );
        }
    } );
	TestRunner.add( test );
} );