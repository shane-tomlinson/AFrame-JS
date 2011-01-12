testsToRun.push( {
		
		name: "TestCase AFrame.FieldValidityState",
		
		testDefaultValidity: function() {
			var validity = AFrame.FieldValidityState.getInstance();
			Assert.isTrue( validity.valid, 'default validity is true' );
		},
		
		testOverriddenValidity: function() {
			var validity = AFrame.FieldValidityState.getInstance( { valid: false } );
			Assert.isFalse( validity.valid, 'validity set to false' );
		}
} );
