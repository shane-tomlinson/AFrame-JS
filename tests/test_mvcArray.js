function testMVCArray( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
		
	var test = new TestCase( {
	 
		name: "TestCase AFrame.MVCArray",

		setUp: function() {
		    this.array = AFrame.construct( {
				type: 'AFrame.MVCArray'
		    } );
			
			this.item = {
				fieldName: 'fieldValue'
			};

		},
		
		tearDown : function () {
		    this.array.teardown();
		    this.array = null;
		    delete this.array;
			
			this.item = null;
			delete this.item;
		},
		
		testInsertGet: function() {
			
			var index = 0;
			var id = this.array.insert( this.item, { index: index } );
			
			var retrievedByIndexItem = this.array.get( index );
			Assert.areSame( this.item, retrievedByIndexItem, 'insert then retrieval by index works' );

			var retrievedByIdItem = this.array.get( id );
			Assert.areSame( this.item, retrievedByIdItem, 'insert then retrieval by id works' );
		},
		
		testInsertMetaSetCorrectly: function() {
			var insertData;
			this.array.bindEvent( 'onInsert', function( data ) {
				insertData = data;
			} );

			var index = 0;
			this.array.insert( this.item, { index: index } );
			
			Assert.areEqual( index, insertData.meta.index, 'index set in the meta data' );
		},
		
		testRemove: function() {
			var index = 0;
			var id = this.array.insert( this.item, { index: index } );
			
			var removedItem = this.array.remove( index );
			Assert.areSame( this.item, removedItem, 'removedItem and original item are the same');
			
			var removedItemByID = this.array.get( id );
			Assert.isUndefined( removedItemByID, 'item really is removed' );
		},
		
		testRemoveByID: function() {
			var index = 0;
			var id = this.array.insert( this.item, { index: index } );
			
			var removedItem = this.array.remove( id );
			
			var removedItemByID = this.array.get( id );
			Assert.isUndefined( removedItemByID, 'item really is removed' );
		},
		
		testGetCount: function() {
			var count = this.array.getCount();
			Assert.areSame( 0, count, 'emtpy gives correct count' );
			
			var index = 0;
			this.array.insert( this.item, { index: index } );
			count = this.array.getCount();
			Assert.areEqual( 1, count, 'one added gives correct count' );
			
			this.array.remove( 0 );
			count = this.array.getCount();
			Assert.areEqual( 0, count, 'one removed gives correct count' );
		},

		testInsertGetWithCID: function() {
			var dataWithCID = {
				cid: 'datacid'
			};
			var cid = this.array.insert( dataWithCID );

			Assert.areEqual( 'datacid', cid, 'cid is correctly set using data' );

			var getData = this.array.get( 'datacid' );
			Assert.areEqual( dataWithCID, getData, 'correct data gotten' );
			
			var getByIndexData = this.array.get( 0 );
			Assert.areEqual( dataWithCID, getByIndexData, 'correct data gotten by index' );
		},

		testInsertWithNegativeIndex: function() {
			
		}
		
	} );
	
	TestRunner.add( test );	
}