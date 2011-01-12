testsToRun.push( {
	 
		name: "TestCase AFrame.CollectionHash",

		setUp: function() {
		    this.hash = AFrame.construct( {
                type: AFrame.CollectionHash
		    } );
		},
		
		tearDown : function () {
		    this.hash.teardown();
		    this.hash = null;
		    delete this.hash;
		},

		testGet: function() {
            var cid = 1;
		    var item = {
                cid: cid,
                fieldName: 'fieldValue'
		    };
		    
		    this.hash.insert( item );
		    var retrievedItem = this.hash.get( cid );
		    
		    Assert.areSame( item, retrievedItem, 'item and the retrievedItem are the same' );
		},
		
		testRemove: function() {
		    var cid = 1;
		    
		    var item = {
                cid: cid,
                fieldName: 'fieldValue'
		    };
		    
		    this.hash.insert( item );
		    var deletedItem = this.hash.remove( cid );
		    Assert.areSame( item, deletedItem, 'got the correct deleted item' );
		    
		    var retrievedItem = this.hash.get( cid );
		    Assert.isUndefined( retrievedItem, 'remove correctly occured' );
		    
		    // assert no blowup
		    var noItemToRemove = this.hash.remove( 2 );
		    Assert.isUndefined( noItemToRemove, 'no item to remove doesn\'t blow up' );
		},
		
		testRemoveEvents: function() {
		    var cid = 1;
		    
		    var item = {
                cid: cid,
				fieldName: 'fieldValue'
		    };
		    
		    this.hash.insert( item );
		  
		    var beforeRemoveData;
		    var onBeforeRemove = function( event ) {
		      beforeRemoveData = event;
		    };
		    
		    var removeData;
		    var onRemove = function( event ) {
		      removeData = event;
		    };
		    
		    this.hash.bindEvent( 'onBeforeRemove', onBeforeRemove );
		    this.hash.bindEvent( 'onRemove', onRemove );
		    
		    this.hash.remove( cid );
		    
		    Assert.areSame( cid, beforeRemoveData.cid, 'onBeforeRemove ids are the same' );
		    Assert.areSame( item, beforeRemoveData.item, 'onBeforeRemove items are the same' );
		    
		    Assert.areSame( cid, removeData.cid, 'onRemove ids are the same' );
		    Assert.areSame( item, removeData.item, 'onRemove items are the same' );
		},
		
		testInsert: function() {
			var item = {
				fieldName: 'fieldValue'
			};
			
			var beforeInsertData;
			this.hash.bindEvent( 'onBeforeInsert', function( data ) {
				beforeInsertData = data;
			} );

			var insertData;
			this.hash.bindEvent( 'onInsert', function( data ) {
				insertData = data;
			} );
			
			var cid = this.hash.insert( item );
			
			Assert.isObject( beforeInsertData, 'beforeInsertData correctly set from onBeforeInsert' );
			Assert.isObject( insertData, 'insertData correctly set from onInsert' );
			Assert.isNotUndefined( item.cid, 'cid was put on the item' );
            
			//Assert.areSame( cid, insertData.cid, 'ids are the same' );
		},

		testInsertWithExistingCID: function() {
			var dataWithCID = {
				cid: 'externalcid',
				fieldName: 'fieldValue'
			};
			var cid = this.hash.insert( dataWithCID );
			
			Assert.areSame( 'externalcid', cid, 'item with cid retains cid' );
        },
				
		testInsertDuplicateCID: function() {
			var item = {
				cid: 1,
				fieldName: 'fieldValue'
			};
			
			this.hash.insert( item );
			
			var except;
			try {
				// this should cause an exception
				this.hash.insert( item );
			}
			catch( e ) {
				except = e;
			}
			
			Assert.areSame( 'duplicate cid', except, 'duplicate cid exception thrown' );
		},
		
		testClear: function() {
			var cid = this.hash.insert( {
				cid: 1,
				fieldName: 'fieldValue'
			} );
			
			this.hash.clear();
			Assert.isUndefined( this.hash.get( cid ), 'could not get item' );
		},
		
		testGetCount: function() {
			var count = this.hash.getCount();
			Assert.areSame( 0, count, 'emtpy gives correct count' );
			
			var cid = this.hash.insert( {} );
			count = this.hash.getCount();
			Assert.areEqual( 1, count, 'one added gives correct count' );
			
			this.hash.remove( cid );
			count = this.hash.getCount();
			Assert.areEqual( 0, count, 'one removed gives correct count' );
		},
        
        testInsertNumber: function() {
			var cid = this.hash.insert( 2 );
            var val = this.hash.get( cid );
            
            Assert.areEqual( 2, val, 'Can insert and get number' );
        },
        
        testFilter: function() {
            var items = [ {
				cid: 1,
				field: 'field1'
			}, {
				cid: 2,
				field: 'field2',
                duplicate: 'duplicate'
			}, {
				cid: 3,
				field: 'field3',
                duplicate: 'duplicate'
			} ];
            
            items.forEach( function( item, index ) {
                this.hash.insert( item );            
            }, this );
            
            var filteredSet = this.hash.filter( function( item, cid ) {
                return item.field == 'field3';
            } );
            
            Assert.isArray( filteredSet, 'filtered set is an array' );
            Assert.areEqual( 1, filteredSet.length, 'filtered set has one found item' );
            Assert.areEqual( items[ 2 ], filteredSet[ 0 ], 'item is the correct item found' );

            filteredSet = this.hash.filter( function( item, cid ) {
                return item.field == 'field4';
            } );
            
            Assert.isArray( filteredSet, 'filtered set is an array' );
            Assert.areEqual( 0, filteredSet.length, 'filtered set has no found items' );

            filteredSet = this.hash.filter( function( item, cid ) {
                return item.duplicate == 'duplicate';
            } );
            
            Assert.areEqual( 2, filteredSet.length, 'filtered set has two found items' );
        },
        
        testSearch: function() {
            var items = [ {
				cid: 1,
				field: 'field1'
			}, {
				cid: 2,
				field: 'field2',
                duplicate: 'duplicate'
			}, {
				cid: 3,
				field: 'field3',
                duplicate: 'duplicate'
			} ];
            
            items.forEach( function( item, index ) {
                this.hash.insert( item );            
            }, this );
            
            var item = this.hash.search( function( item, cid ) {
                return item.field == 'field3';
            } );
            
            Assert.areEqual( items[ 2 ], item, 'item is the correct item found' );

            item = this.hash.search( function( item, cid ) {
                return item.field == 'field4';
            } );
            
            Assert.isUndefined( item, 'item was not found, return undefined' );

            item = this.hash.search( function( item, cid ) {
                return item.duplicate == 'duplicate';
            } );
            
            Assert.areEqual( item, items[ 1 ], 'with duplicate items, first item is returned' );
        },
        
        testForEach: function() {
            var items = [ {
				cid: 1,
				field: 'field1'
			}, {
				cid: 2,
				field: 'field2',
                duplicate: 'duplicate'
			}, {
				cid: 3,
				field: 'field3',
                duplicate: 'duplicate'
			} ];
            
            items.forEach( function( item, index ) {
                this.hash.insert( item );            
            }, this );
            
            var callbackCount = 0;
            this.hash.forEach( function( item, cid ) {
                Assert.isObject( item, 'item is an object' );
                Assert.isString( cid, 'cid is a number' );
                callbackCount++;
            } );
            
            Assert.areEqual( 3, callbackCount, 'callback called once for each item' );
        
        }

} );
