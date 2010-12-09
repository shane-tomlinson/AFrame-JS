testsToRun.push( function testCollectionHash( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
		
	var test = new TestCase( {
	 
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
		
		testSet: function() {
		    var beforeSetData;
		    var onBeforeSet = function( data ) {
			beforeSetData = data;
			
			// adding a field to the data, making sure we get it in onSet
			data.item.field2 = "field2";
		    };
		    
		    var setData;
		    var onSet = function( data ) {
			setData = data;
		    };
		    
		    this.hash.bindEvent( 'onBeforeSet', onBeforeSet );
		    this.hash.bindEvent( 'onSet', onSet );
		    
		    var cid = 1;
		    this.hash.set( cid, {
		      field: 'fieldValue'
		    } );
		    
		    Assert.isObject( beforeSetData, 'onBeforeSet sets data' );
		    Assert.areSame( cid, beforeSetData.meta.cid, 'onBeforeSet gives same cid as insert' );
		    Assert.areSame( 'fieldValue', beforeSetData.item.field, 'onBeforeSet gives data we pass in' );
		    
		    Assert.isObject( setData, 'onSet sets data' );
		    Assert.areSame( cid, setData.meta.cid, 'onSet gives same cid as insert' );
		    Assert.areSame( 'fieldValue', setData.item.field, 'onSet gives data we pass in' );
		    Assert.areSame( 'field2', setData.item.field2, 'onSet gets data set by onBeforeInsert' );
		},
		
		testGet: function() {
		    var item = {
			fieldName: 'fieldValue'
		    };
		    
		    var cid = 1;
		    this.hash.set( cid, item );
		    var retrievedItem = this.hash.get( cid );
		    
		    Assert.areSame( item, retrievedItem, 'item and the retrievedItem are the same' );
		},
		
		testRemove: function() {
		    var item = {
			fieldName: 'fieldValue'
		    };
		    
		    var cid = 1;
		    
		    this.hash.set( cid, item );
		    var deletedItem = this.hash.remove( cid );
		    Assert.areSame( item, deletedItem, 'got the correct deleted item' );
		    
		    var retrievedItem = this.hash.get( cid );
		    Assert.isUndefined( retrievedItem, 'remove correctly occured' );
		    
		    // assert no blowup
		    var noItemToRemove = this.hash.remove( 2 );
		    Assert.isUndefined( noItemToRemove, 'no item to remove doesn\'t blow up' );
		},
		
		testRemoveEvents: function() {
		    var item = {
				fieldName: 'fieldValue'
		    };
		    
		    var cid = 1;
		    
		    this.hash.set( cid, item );
		  
		    var beforeRemoveData;
		    var onBeforeRemove = function( data ) {
		      beforeRemoveData = data;
		    };
		    
		    var removeData;
		    var onRemove = function( data ) {
		      removeData = data;
		    };
		    
		    this.hash.bindEvent( 'onBeforeRemove', onBeforeRemove );
		    this.hash.bindEvent( 'onRemove', onRemove );
		    
		    this.hash.remove( cid );
		    
		    Assert.areSame( cid, beforeRemoveData.meta.cid, 'onBeforeRemove ids are the same' );
		    Assert.areSame( item, beforeRemoveData.item, 'onBeforeRemove items are the same' );
		    
		    Assert.areSame( cid, removeData.meta.cid, 'onRemove ids are the same' );
		    Assert.areSame( item, removeData.item, 'onRemove items are the same' );
		},
		
		testInsert: function() {
			var item = {
				fieldName: 'fieldValue'
			};
			
			var meta = {
				metaField: 'metaValue'
			};
			
			var beforeInsertData;
			this.hash.bindEvent( 'onBeforeInsert', function( data ) {
				beforeInsertData = data;
			} );

			var insertData;
			this.hash.bindEvent( 'onInsert', function( data ) {
				insertData = data;
			} );
			
			var cid = this.hash.insert( item, meta );
			
			Assert.isObject( beforeInsertData, 'beforeInsertData correctly set from onBeforeInsert' );
			Assert.isObject( insertData, 'insertData correctly set from onInsert' );
			
			Assert.areSame( insertData.meta.cid, cid, 'ids are the same' );

		},

		testInsertWithExistingCID: function() {
			var dataWithCID = {
				cid: 'externalcid',
				fieldName: 'fieldValue'
			};
			var cid = this.hash.insert( dataWithCID );
			
			Assert.areSame( 'externalcid', cid, 'item with cid retains cid' );

			var dataWithoutCID = {
				fieldName: 'fieldValue'
			};

			var metaWithCID = {
				cid: 'metacid'
			};

			cid = this.hash.insert( dataWithoutCID, metaWithCID );
			Assert.areSame( 'metacid', cid, 'meta with cid retains cid' );
			
		},
		
		testInsertNoMeta: function() {
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
		}

	} );
	
	
	
	TestRunner.add( test );

} );