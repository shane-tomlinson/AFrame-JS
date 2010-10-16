function testListPluginBindToCollection( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.ListPluginBindToCollection",
		
		setUp: function() {
			this.store = AFrame.construct( {
				type: 'AFrame.MVCArray'
			} );
			
			this.list = AFrame.construct( {
				type: 'AFrame.List',
				config: {
					target: '#AFrame_List .list',
					createListElementCallback: function( index, data ) {
						this.insertedIndex = index;
						this.insertedData = data;
						var rowElement = $( '<li id="' + ( data.id ? data.id : 'inserted' + index ) + '">Inserted Element</li>' );
						return rowElement;
					}.bind( this )
					
				},
				plugins: [
					{
						type: 'AFrame.ListPluginBindToCollection',
						config: {
							collection: this.store
						}
					}
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
			this.store.insert( { id: 'inserted0' } );
			this.store.insert( { id: 'inserted1' } );
			
			Assert.areEqual( 1, $( 'ul > li#inserted0' ).length, 'list element0 inserted' );
			Assert.areEqual( 1, $( 'ul > li#inserted1' ).length, 'list element1 inserted' );
		},
		
		testRemove: function() {
			this.store.insert( { id: 'inserted0' } );
			this.store.insert( { id: 'inserted1' } );
			
			Assert.areEqual( 1, $( 'ul > li#inserted0' ).length, 'list element0 inserted' );
			Assert.areEqual( 1, $( 'ul > li#inserted1' ).length, 'list element1 inserted' );
			
			this.store.remove( 0 );
			Assert.areEqual( 0, $( 'ul > li#inserted0' ).length, 'list element0 removed' );
			Assert.areEqual( 1, $( 'ul > li#inserted1' ).length, 'list element1 not removed' );

			this.store.remove( 0 );
			Assert.areEqual( 0, $( 'ul > li#inserted1' ).length, 'list element1 removed' );
		}
	} );
	
	
	TestRunner.add( test );
}
