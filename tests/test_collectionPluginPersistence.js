
testsToRun.push( function testCollectionPluginPersistence( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.CollectionPluginPersistence no callbacks",
		
		setUp: function() {
			this.mockCollection = Y.Mock();
			AFrame.mixin( this.mockCollection, AFrame.ObservablesMixin );

			this.delCallbackCalled = false;
			this.saveCallbackCalled = false;
			this.loadCallbackCalled = false;
			
			this.mixin = AFrame.construct( {
				type: AFrame.CollectionPluginPersistence,
				config: {
					deleteCallback: function( data, meta, callback ) {
						this.delCallbackCalled = true;
						callback();
					}.bind( this ),
					saveCallback: function( data, meta, callback ) {
						this.saveCallbackCalled = true;
						callback();
					}.bind( this ),
					loadCallback: function( meta, callback ) {
						this.loadCallbackCalled = true;
						callback( [ { item: 'item' } ] );
					}.bind( this )
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
			Assert.isFunction( this.mockCollection.del, 'del function added' );
			Assert.isFunction( this.mockCollection.load, 'load function added' );
			Assert.isFunction( this.mockCollection.save, 'save function added' );
		},

		testAdd: function() {
			Y.Mock.expect( this.mockCollection, {
				method: 'insert',
				args: [ Y.Mock.Value.Object, Y.Mock.Value.Object ]
			} );
			
			var callbackCalled = false;
			this.mockCollection.add( {}, {
				callback: function() {
					callbackCalled = true;
				}
			} );

			Assert.isTrue( callbackCalled, 'callback called' );
			Y.Mock.verify( this.mockCollection );
		},

		testDelete: function() {
			var getData;
			var removeCalled = false;
			
			this.mockCollection.remove = function(){
				removeCalled = true;
			};
			
			this.mockCollection.get = function( rowID ) {
				return getData;
			}.bind( this.mockCollection );

			// using a fake rowID because rowID is undefined.
			this.mockCollection.del( 'rowID', {} );

			Assert.isFalse( this.delCallbackCalled, 'row did not exist to delete data' );
			Assert.isFalse( removeCalled, 'row did not exist to delete data' );
			
			getData = "someData";
			var callbackCalled = false;
			this.mockCollection.del( 'rowID', {
				callback: function() {
					callbackCalled = true;
				}
			} );
			Assert.isTrue( this.delCallbackCalled, 'delete callback called' );
			Assert.isTrue( removeCalled, 'remove called' );
			Assert.isTrue( callbackCalled, 'callback called' );
		},

		testLoad: function() {
			var callbackCalled = false;
			var insertCalled = true;
			this.mockCollection.insert = function( data, meta ) {
				insertCalled = true;
			};
			this.mockCollection.load( {
				callback: function() {
					callbackCalled = true;
				}
			} );
			Assert.isTrue( callbackCalled, 'callback called' );
			Assert.isTrue( this.loadCallbackCalled, 'loadCallbackCalled called' );
			Assert.isTrue( insertCalled, 'insert called for one item' );
		},

		testSave: function() {
			var getData;
			this.mockCollection.get = function( rowID ) {
				return getData;
			}.bind( this.mockCollection );
			
			// using a fake rowID because rowID is undefined.
			this.mockCollection.save( 'rowID', {} );
			Assert.isFalse( this.saveCallbackCalled, 'row did not exist to save data' );

			getData = "someData";
			
			var callbackCalled = false;
			this.mockCollection.save( 'rowID', {
				callback: function() {
					callbackCalled = true;
				}
			} );
			Assert.isTrue( this.saveCallbackCalled, 'save callback called' );
			Assert.isTrue( callbackCalled, 'callback called' );
		}

	} );

	TestRunner.add( test );
} );
