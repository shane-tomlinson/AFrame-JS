testsToRun.push( {

		name: "TestCase AFrame.FieldValidityState",

		testDefaultValidity: function() {
			var validity = AFrame.FieldValidityState.create();
			Assert.isTrue( validity.valid, 'default validity is true' );
		},

		testOverriddenValidity: function() {
			var validity = AFrame.FieldValidityState.create( { valid: false } );
			Assert.isFalse( validity.valid, 'validity set to false' );
		}
} );
