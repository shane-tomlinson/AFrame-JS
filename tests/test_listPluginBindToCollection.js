testsToRun.push( function testListPluginBindToCollection( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var testWithMVCArray = new TestCase( {
		
		name: "TestCase AFrame.ListPluginBindToCollection with MVCArray",
		
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
						var rowElement = $( '<li id="' + ( data.cid ? data.cid : 'inserted' + index ) + '">Inserted Element</li>' );
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
			this.store.insert( { cid: 'inserted0' } );
			this.store.insert( { cid: 'inserted1' } );
			
			Assert.areEqual( 1, $( 'ul > li#inserted0' ).length, 'list element0 inserted' );
			Assert.areEqual( 1, $( 'ul > li#inserted1' ).length, 'list element1 inserted' );
		},
		
		testRemove: function() {
			this.store.insert( { cid: 'inserted0' } );
			this.store.insert( { cid: 'inserted1' } );
			
			Assert.areEqual( 1, $( 'ul > li#inserted0' ).length, 'list element0 inserted' );
			Assert.areEqual( 1, $( 'ul > li#inserted1' ).length, 'list element1 inserted' );
			
			this.store.remove( 0 );
			Assert.areEqual( 0, $( 'ul > li#inserted0' ).length, 'list element0 removed' );
			Assert.areEqual( 1, $( 'ul > li#inserted1' ).length, 'list element1 not removed' );

			this.store.remove( 'inserted1' );
			Assert.areEqual( 0, $( 'ul > li#inserted1' ).length, 'list element1 removed' );
		}
	} );
	
	var testWithMVCHash = new TestCase( {
		
		name: "TestCase AFrame.ListPluginBindToCollection with MVCHash",
		
		setUp: function() {
			this.store = AFrame.construct( {
				type: 'AFrame.MVCHash'
			} );
			
			this.list = AFrame.construct( {
				type: 'AFrame.List',
				config: {
					target: '#AFrame_List .list',
					createListElementCallback: function( index, data ) {
						this.insertedIndex = index;
						this.insertedData = data;
						var rowElement = $( '<li id="' + ( data.cid ? data.cid : 'inserted' + index ) + '">Inserted Element</li>' );
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
			this.store.insert( { cid: 'inserted0' } );
			this.store.insert( { cid: 'inserted1' } );
			
			Assert.areEqual( 1, $( 'ul > li#inserted0' ).length, 'list element0 inserted' );
			Assert.areEqual( 1, $( 'ul > li#inserted1' ).length, 'list element1 inserted' );
		},
		
		testRemove: function() {
			this.store.insert( { cid: 'inserted0' } );
			this.store.insert( { cid: 'inserted1' } );
			
			Assert.areEqual( 1, $( 'ul > li#inserted0' ).length, 'list element0 inserted' );
			Assert.areEqual( 1, $( 'ul > li#inserted1' ).length, 'list element1 inserted' );
			
			this.store.remove( 'inserted0' );
			Assert.areEqual( 0, $( 'ul > li#inserted0' ).length, 'list element0 removed' );
			Assert.areEqual( 1, $( 'ul > li#inserted1' ).length, 'list element1 not removed' );
			
			this.store.remove( 'inserted1' );
			Assert.areEqual( 0, $( 'ul > li#inserted1' ).length, 'list element1 removed' );
		}
	} );
	
	TestRunner.add( testWithMVCArray );
	TestRunner.add( testWithMVCHash );
} );