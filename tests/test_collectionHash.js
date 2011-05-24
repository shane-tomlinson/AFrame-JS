testsToRun.push( {

		name: "TestCase AFrame.CollectionHash",

		setUp: function() {
		    this.hash = AFrame.CollectionHash.create();
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

        testRemovePreventedInOnBeforeRemove: function() {
            var bindCID = this.hash.bindEvent( 'onBeforeRemove', function( event ) {
                event.preventDefault();
            } );

            var cid = 1;
            var item = {
                cid: cid,
                fieldName: 'fieldValue'
            };

            this.hash.insert( item );

            var removedItem = this.hash.remove( 1 );

            Assert.isUndefined( removedItem, 'onBeforeRemove prevented the removal of the item' );

            this.hash.unbindEvent( bindCID );
        },

        testRemoveForced: function() {
            var bindCID = this.hash.bindEvent( 'onBeforeRemove', function( event ) {
                event.preventDefault();
            } );

            var cid = 1;
            var item = {
                cid: cid,
                fieldName: 'fieldValue'
            };

            this.hash.insert( item );

            var removedItem = this.hash.remove( 1, {
                force: true
            } );

            Assert.areEqual( removedItem, item, 'item was forcibly removed' );

            this.hash.unbindEvent( bindCID );
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

        testInsertHashPreventedInOnBeforeInsert: function() {
            var bindCID = this.hash.bindEvent( 'onBeforeInsert', function( event ) {
                event.preventDefault();
            } );

		    var item = {
				fieldName: 'fieldValue'
		    };

            var cid = this.hash.insert( item );

            Assert.isUndefined( cid, 'onBeforeInsert prevented the insertion of the item' );

            this.hash.unbindEvent( bindCID );

        },

        testInsertForced: function() {
            var bindCID = this.hash.bindEvent( 'onBeforeInsert', function( event ) {
                event.preventDefault();
            } );

            var item = {
                fieldName: 'fieldValue'
            };

            var cid = this.hash.insert( item, {
                force: true
            } );

            Assert.isString( cid, 'item was forcibly inserted' );

            this.hash.unbindEvent( bindCID );
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
