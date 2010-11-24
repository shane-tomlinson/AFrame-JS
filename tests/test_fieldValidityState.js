testsToRun.push( function testField( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.FieldValidity",
		
		testDefaultValidity: function() {
			var validity = AFrame.FieldValidity.getInstance();
			Assert.isTrue( validity.valid, 'default validity is true' );
		},
		
		testOverriddenValidity: function() {
			var validity = AFrame.FieldValidity.getInstance( { valid: false } );
			Assert.isFalse( validity.valid, 'validity set to false' );
		}
	} );

	TestRunner.add( test );
} );
