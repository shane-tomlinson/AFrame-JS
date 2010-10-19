
function testCollectionPluginPersistence( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.CollectionPluginPersistence",
		
		setUp: function() {
			this.mockCollection = Y.Mock();
			AFrame.mixin( this.mockCollection, AFrame.ObservablesMixin );
			
			this.mixin = AFrame.construct( {
				type: 'AFrame.CollectionPluginPersistence',
				config: {
				}
			} );

			this.mixin.setPlugged( this.mockCollection );
			this.mockCollection.triggerEvent( 'onInit' );
		},

		teardDown: function() {
			this.mockCollection = null;
			this.mixin.teardown();
			this.mixin = null;
		},

		testFunctionsAreThere: function() {
			Assert.isFunction( this.mockCollection.add, 'add function added' );
			Assert.isFunction( this.mockCollection[ 'delete' ], 'delete function added' );
			Assert.isFunction( this.mockCollection.load, 'load function added' );
			Assert.isFunction( this.mockCollection.save, 'save function added' );
		}
	} );

	TestRunner.add( test );
}
