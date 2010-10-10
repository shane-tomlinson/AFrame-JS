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
			var id = this.array.insert( index, this.item );
			
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
			
			this.array.insert( 0, this.item );
			
			Assert.areEqual( 0, insertData.meta.index, 'index set in the meta data' );
		},
		
		testPush: function() {
			var id = this.array.push( this.item );

			var retrievedByIdItem = this.array.get( id );
			Assert.areSame( this.item, retrievedByIdItem, 'push then retrieval by id works' );
		},
		
		testRemove: function() {
			var index = 0;
			var id = this.array.insert( index, this.item );
			
			var removedItem = this.array.remove( index );
			Assert.areSame( this.item, removedItem, 'removedItem and original item are the same');
			
			var removedItemByID = this.array.get( id );
			Assert.isUndefined( removedItemByID, 'item really is removed' );
		},
		
		testRemoveByID: function() {
			var index = 0;
			var id = this.array.insert( index, this.item );
			
			var removedItem = this.array.remove( id );
			
			var removedItemByID = this.array.get( id );
			Assert.isUndefined( removedItemByID, 'item really is removed' );
		},
		
		testGetCount: function() {
			var count = this.array.getCount();
			Assert.areSame( 0, count, 'emtpy gives correct count' );
			
			this.array.insert( 0, this.item );
			count = this.array.getCount();
			Assert.areEqual( 1, count, 'one added gives correct count' );
			
			this.array.remove( 0 );
			count = this.array.getCount();
			Assert.areEqual( 0, count, 'one removed gives correct count' );
		}
		
	} );
	
	TestRunner.add( test );	
}