
testsToRun.push( {
		
		name: "TestCase AFrame.CollectionPluginPersistence no callbacks",
		
		setUp: function() {
			this.mockCollection = Mock();
			AFrame.mixin( this.mockCollection, AFrame.ObservablesMixin );

			this.delCallbackCalled = false;
			this.saveCallbackCalled = false;
			this.loadCallbackCalled = false;
			
			this.mixin = AFrame.construct( {
				type: AFrame.CollectionPluginPersistence,
				config: {
					deleteCallback: function( data, options ) {
                        var callback = options.onComplete;
						this.delCallbackCalled = true;
						callback();
					}.bind( this ),
					saveCallback: function( data, options ) {
                        var callback = options.onComplete;
						this.saveCallbackCalled = true;
						callback();
					}.bind( this ),
					loadCallback: function( options ) {
                        var callback = options.onComplete;
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
			this.mockCollection.insert = function() {
                return 'cid';
			};
			
			var callbackCalled = false;
            var cid;
			this.mockCollection.add( {}, {
				onComplete: function( data, options ) {
                    cid = options.cid;
					callbackCalled = true;
				}
			} );

			Assert.isTrue( callbackCalled, 'callback called' );
			Assert.isString( cid, 'cid assigned' );
			Mock.verify( this.mockCollection );

            callbackCalled = false;
            
			Mock.expect( this.mockCollection, {
				method: 'insert',
				args: [ Mock.Value.Object, Mock.Value.Number ]
			} );
			this.mockCollection.add( {}, {
				onComplete: function() {
					callbackCalled = true;
				},
                insertAt: 1
			} );
			Assert.isTrue( callbackCalled, 'callback called for insert with index' );
			Mock.verify( this.mockCollection );
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
				onComplete: function() {
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
			this.mockCollection.insert = function( data, options ) {
				insertCalled = true;
			};
			this.mockCollection.load( {
				onComplete: function() {
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
				onComplete: function() {
					callbackCalled = true;
				}
			} );
			Assert.isTrue( this.saveCallbackCalled, 'save callback called' );
			Assert.isTrue( callbackCalled, 'callback called' );
		}

} );
