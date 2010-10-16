function testPlugin( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.Plugin",
		
		setUp: function() {
			
			this.pluggedObject = AFrame.construct( {
				type: 'AFrame.AObject',
				plugins: [
					{
						type: 'AFrame.Plugin'
					}
				]
			} );
			this.plugin = AFrame.construct( {
				type: 'AFrame.Plugin'
			} );
		},
		
		tearDown : function () {
			this.pluggedObject.teardown();
			this.pluggedObject = null;
			delete this.pluggedObject;

			this.plugin.teardown();
			this.plugin = null;
			delete this.plugin;
			
		},
		
		testPlugged: function() {
			this.plugin.setPlugged( this.pluggedObject );
			var plugged = this.plugin.getPlugged();

			Assert.isObject( plugged, 'plugged is an object' );
			Assert.areEqual( plugged, this.pluggedObject, 'plugged object correctly set' );
		}
	} );

	TestRunner.add( test );
}