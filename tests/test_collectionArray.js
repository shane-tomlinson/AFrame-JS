testsToRun.push( {

		name: "TestCase AFrame.CollectionArray",

		setUp: function() {
		    this.array = AFrame.CollectionArray.create();

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
			var id = this.array.insert( this.item, index );

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
			this.array.insert( this.item, index );

			Assert.areEqual( index, insertData.index, 'index set in the meta data' );
		},

		testRemove: function() {
			var index = 0;
			var id = this.array.insert( this.item, index );

			var removedItem = this.array.remove( index );
			Assert.areSame( this.item, removedItem, 'removedItem and original item are the same');

			var removedItemByID = this.array.get( id );
			Assert.isUndefined( removedItemByID, 'item really is removed' );
		},

		testRemoveByID: function() {
			var index = 0;
			var id = this.array.insert( this.item, index );

			var removedItem = this.array.remove( id );

			var removedItemByID = this.array.get( id );
			Assert.isUndefined( removedItemByID, 'item really is removed' );
		},

		testGetCount: function() {
			var count = this.array.getCount();
			Assert.areSame( 0, count, 'emtpy gives correct count' );

			var index = 0;
			this.array.insert( this.item, index );
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
			var cid = this.array.insert( this.item, -1 );
			var item = this.array.get( -1 );

            Assert.areEqual( this.item, item, 'can insert and retreive using -1' );
		},

		testGetInvalidIndex: function() {
			var cid = this.array.insert( this.item );

			// there is only one item in the array
			var item = this.array.get( 2 );
			Assert.isUndefined( item );

			var item = this.array.get( -5 );
			Assert.isUndefined( item );
		},

		testClear: function() {
			var cid = this.array.insert( this.item );
			Assert.areEqual( 1, this.array.getCount(), 'item inserted' );

			this.array.clear();
			Assert.areEqual( 0, this.array.getCount(), 'array cleared' );

			var item = this.array.get( cid );
			Assert.isUndefined( item, 'could not get item' );
		},

        testForEach: function() {
            var items = [ {
				cid: '1',
				field: 'field1'
			}, {
				cid: '2',
				field: 'field2',
                duplicate: 'duplicate'
			}, {
				cid: '3',
				field: 'field3',
                duplicate: 'duplicate'
			} ];

            items.forEach( function( item, index ) {
                this.array.insert( item );
            }, this );

            var callbackCount = 0;
            this.array.forEach( function( item, index ) {
                Assert.isObject( item, 'item is an object' );
                //Assert.isNumber( index, 'index is a number' );
                callbackCount++;
            } );

            Assert.areEqual( 3, callbackCount, 'callback called once for each item' );
        }

} );
