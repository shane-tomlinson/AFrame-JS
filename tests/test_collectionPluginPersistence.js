
testsToRun.push( function testCollectionPluginPersistence( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.CollectionPluginPersistence no callbacks",
		
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
		},

		testAdd: function() {
			Y.Mock.expect( this.mockCollection, {
				method: 'insert',
				args: [ Y.Mock.Value.Object, Y.Mock.Value.Object ]
			} );
			
			this.mockCollection.add( {}, {} );

			Y.Mock.verify( this.mockCollection );
		},

		testDelete: function() {
			Y.Mock.expect( this.mockCollection, {
				method: 'insert',
				args: [ Y.Mock.Value.Object, Y.Mock.Value.Object ]
			} );

			var rowID = this.mockCollection.add( {}, {} );

			Y.Mock.expect( this.mockCollection, {
				method: 'remove',
				args: [ Y.Mock.Value.String, Y.Mock.Value.Object ]
			} );

			this.mockCollection[ 'delete' ]( 'rowID', {} );

			Y.Mock.verify( this.mockCollection );
		}

	} );

	TestRunner.add( test );
} );
