
testsToRun.push( {
		
		name: "TestCase AFrame.CollectionPluginPersistence no callbacks",
		
		setUp: function() {
			this.mockCollection = Mock();
			AFrame.mixin( this.mockCollection, AFrame.ObservablesMixin );
			AFrame.mixin( this.mockCollection, {
                shouldDoAction: AFrame.CollectionHash.prototype.shouldDoAction
			} );

            this.mockCollection.canGet = function() {
                this.get = function() {
                    return "someData";
                };
            }
            
            this.mockCollection.cannotGet = function() {
                this.get = function() {};
            };
            
            this.removeCalled = false;
            this.mockCollection.remove = function() {
                this.removeCalled = true;
            }.bind( this );
            
            this.insertCalled = false;
            this.mockCollection.insert = function() {
                this.insertCalled = true;
                return 'cid';
            }.bind( this );
            
            
            /*
            * Sets up the generic adapter callback functions
            */
            var callbacks = this.callbacksCalled = {};
            var genericCallback = function( data, options ) {
                if( !options ) {
                    options = data;
                }
                var callback = options && options.onComplete;
                callbacks[ this ] = true;
                if( this == 'load' ) {
                    callback( [ { item: 'item' } ] );
                }
                else if( this == 'add' ) {
                    callback( {
                        cid: 'overriddencid'
                    } );
                }
                else {
                    callback();
                }
            };
            
			this.mixin = AFrame.create( AFrame.CollectionPluginPersistence, {
                deleteCallback: genericCallback.bind( 'delete' ),
                saveCallback: genericCallback.bind( 'save' ),
                loadCallback: genericCallback.bind( 'load' ),
                addCallback: genericCallback.bind( 'add' ),
                plugged: this.mockCollection
			} );

			this.mockCollection.triggerEvent( 'onInit' );
            
            /*
            * These are generic event handlers that are used everywhere.  They keep track of which
            *   events were called
            */
            var events = this.events = {};
            this.genericEventHandler = function( event ) {
                events[ event.type ] = event;
            };
            
            this.genericPreventDefaultEventHandler = function( event ) {
                events[ event.type ] = event;
                event.preventDefault();
            };
            
            /*
            * These are generic persistence options.  One forces, the other doesn't, both have
            *   onComplete functions
            */
            this.onCompleteCallbackCalled = false;
            this.persistenceOptions = {
				onComplete: function() {
					this.onCompleteCallbackCalled = true;
				}.bind( this )
			};

            this.persistenceOptionsForced = {
				onComplete: function() {
					this.onCompleteCallbackCalled = true;
				}.bind( this ),
                force: true
			};
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
			var callbackCalled = false, cid;
            
            var beforeAddCID = this.mockCollection.bindEvent( 'onBeforeAdd', this.genericEventHandler );
            var addCID = this.mockCollection.bindEvent( 'onAdd', this.genericEventHandler );
            
			this.mockCollection.add( {}, {
				onComplete: function( data, options ) {
                    cid = options.cid;
					callbackCalled = true;
				}
			} );

			Assert.isTrue( callbackCalled, 'callback called' );
			Assert.isString( cid, 'cid assigned' );
            
            Assert.isObject( this.events[ 'onAdd' ] );
            Assert.isObject( this.events[ 'onBeforeAdd' ] );
            
            this.mockCollection.unbindEvent( beforeAddCID );
            this.mockCollection.unbindEvent( addCID );
        },
        
        testAddIndex: function() {
            var callbackCalled = false;
            
			this.mockCollection.add( {}, {
				onComplete: function() {
					callbackCalled = true;
				},
                insertAt: 1
			} );
			Assert.isTrue( callbackCalled, 'callback called for insert with index' );
		},
        
        
        testAddCancelled: function() {
            var beforeAddCID = this.mockCollection.bindEvent( 'onBeforeAdd', this.genericPreventDefaultEventHandler );
            
			this.mockCollection.add( {}, this.persistenceOptions );

			Assert.isFalse( this.onCompleteCallbackCalled, 'insert never occurred, onBeforeAdd event had preventDefault called' );
			Mock.verify( this.mockCollection );
            
            this.mockCollection.unbindEvent( beforeAddCID );
        },

        testAddForced: function() {
            var beforeAddCID = this.mockCollection.bindEvent( 'onBeforeAdd', this.genericPreventDefaultEventHandler )
            
			this.mockCollection.add( {}, this.persistenceOptionsForced );

			Assert.isTrue( this.onCompleteCallbackCalled, 'insert was forced' );
			Mock.verify( this.mockCollection );
            
            this.mockCollection.unbindEvent( beforeAddCID );
        },

        testAddUsesModelPassedByDBAccess: function() {
            var insertedModel;
            
            this.mockCollection.add( {
                cid: 'initialcid'
            }, {
                onComplete: function( item, options ) {
                    insertedModel = item;
                }
            } );
            
            Assert.areSame( "overriddencid", insertedModel.cid, 'item added was overridden by db accessor function, item inserted is item given from db access' );
        },
        

		testDeleteNoData: function() {
            this.mockCollection.cannotGet();

			// using a fake rowID because rowID is undefined.
			this.mockCollection.del( 'rowID', this.persistenceOptions );

			Assert.isUndefined( this.callbacksCalled[ 'delete' ], 'row did not exist to delete data' );
			Assert.isFalse( this.removeCalled, 'row did not exist to delete data' );
        },
        
		testDelete: function() {	
			this.mockCollection.canGet();

			this.mockCollection.del( 'rowID', this.persistenceOptions );

			Assert.isTrue( this.callbacksCalled[ 'delete' ], 'delete callback called' );
			Assert.isTrue( this.removeCalled, 'remove called' );
			Assert.isTrue( this.onCompleteCallbackCalled, 'callback called' );
		},
        
        testDeleteCancelled: function() {
            var beforeDeleteCID = this.mockCollection.bindEvent( 'onBeforeDelete', 
                this.genericPreventDefaultEventHandler );
            
			this.mockCollection.canGet();
			this.mockCollection.del( 'rowID', this.persistenceOptions );
            
			Assert.isFalse( this.onCompleteCallbackCalled, 'callback not called' );
            
            this.mockCollection.unbindEvent( beforeDeleteCID );
        },

        testDeleteForced: function() {
            var beforeDeleteCID = this.mockCollection.bindEvent( 'onBeforeDelete',
                this.genericPreventDefaultEventHandler );
                
			this.mockCollection.canGet();

			this.mockCollection.del( 'rowID', this.persistenceOptionsForced );
            
			Assert.isTrue( this.onCompleteCallbackCalled, 'delete was forced' );
			Assert.isTrue( this.removeCalled, 'delete was forced' );
            
            this.mockCollection.unbindEvent( beforeDeleteCID );
        },

		testLoad: function() {
			this.mockCollection.canGet();
			this.mockCollection.load( this.persistenceOptions );
            
			Assert.isTrue( this.onCompleteCallbackCalled, 'callback called' );
			Assert.isTrue( this.callbacksCalled[ 'load' ], 'callbacks[ \'load\' ] called' );
			Assert.isTrue( this.insertCalled, 'insert called for one item' );
		},
        
        testLoadCancelled: function() {
			this.mockCollection.canGet();
            var beforeLoadCID = this.mockCollection.bindEvent( 'onBeforeLoad', this.genericPreventDefaultEventHandler );

			this.mockCollection.load( this.persistenceOptions );
            
			Assert.isFalse( this.onCompleteCallbackCalled, 'callback not called, load cancelled' );
			Assert.isUndefined( this.callbacksCalled[ 'load' ], 'callbacks[ \'load\' ] not called, load cancelled' );

            this.mockCollection.unbindEvent( beforeLoadCID );
        },
        

		testLoadForced: function() {
			this.mockCollection.canGet();

            var beforeLoadCID = this.mockCollection.bindEvent( 'onBeforeLoad', this.genericPreventDefaultEventHandler );

			this.mockCollection.load( this.persistenceOptionsForced );
            
			Assert.isTrue( this.onCompleteCallbackCalled, 'callback called, load forced' );
			Assert.isTrue( this.callbacksCalled[ 'load' ], 'callbacks[ \'load\' ] called, load forced' );
			Assert.isTrue( this.insertCalled, 'insert called for one item, load forced' );

            this.mockCollection.unbindEvent( beforeLoadCID );
		},
        

		testSaveNoData: function() {
			this.mockCollection.cannotGet();
			
			// using a fake rowID because rowID is undefined - since the collection cannot get it,
            //  that means there is no data to save
			this.mockCollection.save( 'rowID', {} );
			Assert.isUndefined( this.callbacksCalled[ 'save' ], 'row did not exist to save data' );
        },
        
        testSave: function() {
			this.mockCollection.canGet();
			
			this.mockCollection.save( 'rowID', this.persistenceOptions );
            
			Assert.isTrue( this.callbacksCalled[ 'save' ], 'save callback called' );
			Assert.isTrue( this.onCompleteCallbackCalled, 'callback called' );
		},
        
        testSaveCancelled: function() {
			this.mockCollection.canGet();
			
            var beforeSaveCID = this.mockCollection.bindEvent( 'onBeforeSave', this.genericPreventDefaultEventHandler );
            
			this.mockCollection.save( 'rowID', this.persistenceOptions );
            
			Assert.isUndefined( this.callbacksCalled[ 'save' ], 'save was cancelled' );
			Assert.isFalse( this.onCompleteCallbackCalled, 'callback not called, save was cancelled' );
            
            this.mockCollection.unbindEvent( beforeSaveCID );
        },
        
        testSaveForced: function() {
			this.mockCollection.canGet();
			
            var beforeSaveCID = this.mockCollection.bindEvent( 'onBeforeSave', this.genericPreventDefaultEventHandler );
            
			this.mockCollection.save( 'rowID', this.persistenceOptionsForced );
            
			Assert.isTrue( this.callbacksCalled[ 'save' ], 'save was forced' );
			Assert.isTrue( this.onCompleteCallbackCalled, 'callback called, save was forced' );
            
            this.mockCollection.unbindEvent( beforeSaveCID );
        }

} );
