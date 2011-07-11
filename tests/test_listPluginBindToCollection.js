testsToRun.push( {

		name: "TestCase AFrame.ListPluginBindToCollection with CollectionArray",

		setUp: function() {
			this.store = AFrame.CollectionArray.create();

			this.list = AFrame.List.create( {
                target: '.list',
                renderItem: function( data, index ) {
                    this.insertedIndex = index;
                    this.insertedData = data;

                    var rowElement = AFrame.DOM.createElement( 'li', 'Inserted Element' );
                    AFrame.DOM.setAttr( rowElement, 'id', ( data.cid ? data.cid : 'inserted' + index ) );
                    return rowElement;
                }.bind( this ),
				plugins: [
					[ AFrame.ListPluginBindToCollection, {
                        collection: this.store
                      }
                    ]
				]
			} );
		},

		tearDown: function() {
			this.store.teardown();
			this.list.clear();
			this.list.teardown();

			AFrame.remove( this, 'store' );
			AFrame.remove( this, 'list' );
		},

		testInsert: function() {
			this.store.insert( { cid: 'inserted0' } );
			this.store.insert( { cid: 'inserted1' } );

			Assert.areEqual( 1, jQuery( 'ul > li#inserted0' ).length, 'list element0 inserted' );
			Assert.areEqual( 1, jQuery( 'ul > li#inserted1' ).length, 'list element1 inserted' );
		},

		testRemove: function() {
			this.store.insert( { cid: 'inserted0' } );
			this.store.insert( { cid: 'inserted1' } );

			Assert.areEqual( 1, jQuery( 'ul > li#inserted0' ).length, 'list element0 inserted' );
			Assert.areEqual( 1, jQuery( 'ul > li#inserted1' ).length, 'list element1 inserted' );

			this.store.remove( 0 );
			Assert.areEqual( 0, jQuery( 'ul > li#inserted0' ).length, 'list element0 removed' );
			Assert.areEqual( 1, jQuery( 'ul > li#inserted1' ).length, 'list element1 not removed' );

			this.store.remove( 'inserted1' );
			Assert.areEqual( 0, jQuery( 'ul > li#inserted1' ).length, 'list element1 removed' );
		},

		testGetIndex: function() {
			this.store.insert( { cid: 'inserted0' } );
			this.store.insert( { cid: 'inserted1' } );

			var index = this.list.getIndex( 'inserted1' );
			Assert.areEqual( 1, index, 'correct index' );

			var index = this.list.getIndex( 0 );
			Assert.areEqual( 0, index, 'correct index' );
		}
	} );

testsToRun.push( {

		name: "TestCase AFrame.ListPluginBindToCollection with CollectionHash",

		setUp: function() {
			this.store = AFrame.CollectionHash.create();

			this.list = AFrame.List.create( {
                target: '.list',
                renderItem: function( data, index ) {
                    this.insertedIndex = index;
                    this.insertedData = data;
                    var rowElement = AFrame.DOM.createElement( 'li', 'Inserted Element' );
                    AFrame.DOM.setAttr( rowElement, 'id', ( data.cid ? data.cid : 'inserted' + index ) );
                    return rowElement;
                }.bind( this ),
				plugins: [ [ AFrame.ListPluginBindToCollection, {
						collection: this.store
					}
				] ]
			} );
		},

		tearDown: function() {
			this.store.teardown();
			this.list.clear();
			this.list.teardown();

			AFrame.remove( this, 'store' );
			AFrame.remove( this, 'list' );
		},

		testInsert: function() {
			this.store.insert( { cid: 'inserted0' } );
			this.store.insert( { cid: 'inserted1' } );

			Assert.areEqual( 1, jQuery( 'ul > li#inserted0' ).length, 'list element0 inserted' );
			Assert.areEqual( 1, jQuery( 'ul > li#inserted1' ).length, 'list element1 inserted' );
		},

		testRemove: function() {
			this.store.insert( { cid: 'inserted0' } );
			this.store.insert( { cid: 'inserted1' } );

			Assert.areEqual( 1, jQuery( 'ul > li#inserted0' ).length, 'list element0 inserted' );
			Assert.areEqual( 1, jQuery( 'ul > li#inserted1' ).length, 'list element1 inserted' );

			this.store.remove( 'inserted0' );
			Assert.areEqual( 0, jQuery( 'ul > li#inserted0' ).length, 'list element0 removed' );
			Assert.areEqual( 1, jQuery( 'ul > li#inserted1' ).length, 'list element1 not removed' );

			this.store.remove( 'inserted1' );
			Assert.areEqual( 0, jQuery( 'ul > li#inserted1' ).length, 'list element1 removed' );
		},

		testGetIndex: function() {
			this.store.insert( { cid: 'inserted0' } );
			this.store.insert( { cid: 'inserted1' } );

			var index = this.list.getIndex( 'inserted1' );
			Assert.areEqual( 1, index, 'correct index' );

			var index = this.list.getIndex( 0 );
			Assert.areEqual( 0, index, 'correct index' );
		}
} );
