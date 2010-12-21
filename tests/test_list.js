testsToRun.push( function testList( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.List",
		
		setUp: function() {
			this.list = AFrame.construct( {
				type: AFrame.List,
				config: {
					target: '.list',
					listElementFactory: function( data, index ) {
						this.insertedIndex = index;
						this.insertedData = data;
						var rowElement = $( '<li id="' + ( data.cid ? data.cid : 'inserted' + index ) + '">Inserted Element</li>' );
						return rowElement;
					}.bind( this )
					
				}
			} );
		},
		
		tearDown : function () {
			$( '.list' ).html( '' );
			
			this.list.teardown();
			this.list= null;
			delete this.list;
		},

		testInsert: function() {
			this.list.insert( { field: 'fieldValue' } );
			
			Assert.areEqual( 0, this.insertedIndex, 'create function called for correct index' );
			Assert.areEqual( 'fieldValue', this.insertedData.field, 'create function called with correct data' );
			Assert.areEqual( 1, $( 'ul > li#inserted0' ).length, 'list element inserted' );

			this.list.insert( { field: 'fieldValue' }, 1 );
			Assert.areEqual( 1, $( 'ul > li#inserted1' ).length, 'second list element inserted' );

			this.list.insert( { cid: 'insertedBefore1' }, 1 );
			Assert.areEqual( 1, $( 'ul > li#insertedBefore1' ).length, 'third list element inserted' );

			Assert.areEqual( 1, $( 'li#insertedBefore1 + li#inserted1' ).length, 'third inserted in correct order' );

			this.list.insert( { cid: 'insertedOutOfOrder' }, 10 );
			Assert.areEqual( 1, $( 'li#insertedOutOfOrder' ).length, 'out of order insert inserts at end' );

			var insertData;
			this.list.bindEvent( 'onInsert', function( data ) {
				insertData = data;
			} );

			var insertElementData;
			this.list.bindEvent( 'onInsertElement', function( data ) {
				insertElementData = data;
			} );

			this.list.insert( { cid: 'insertWithObservable' }, Infinity );
			Assert.areEqual( 'insertWithObservable', insertData.data.cid, 'onInsert data set correctly' );
			Assert.isNotUndefined( insertData.index, 'onInsert data index set correctly' );
			Assert.isNotUndefined( insertData.rowElement, 'onInsert rowElement set correctly' );
			
			Assert.isNotUndefined( insertElementData.index, 'onInsertElement data index set correctly' );
			Assert.isNotUndefined( insertElementData.rowElement, 'onInsertElement rowElement set correctly' );
			
		},

		testInsertNegativeIndex: function() {
			this.list.insert( { cid: 'insertedAtEnd0' }, -1 );
			Assert.areEqual( 0, this.insertedIndex, '-1 inserts at end' );

			this.list.insert( { cid: 'insertedAtEnd1' }, -1 );
			Assert.areEqual( 1, this.insertedIndex, '-1 inserts second at end' );

			this.list.insert( { cid: 'insertedAtEnd3' }, -2 );
			Assert.areEqual( 1, this.insertedIndex, '-2 inserts third at 2 from end' );
			
		},

		testInsertElement: function() {
			this.list.insertElement( $( '<li id="insertRowInsert">Insert Row Insert</li>' ) );
			Assert.areEqual( 1, $( 'li#insertRowInsert' ).length, 'insertRow correctly working' );
		},

		testRemove: function() {
			this.list.insert( { cid: 'li0' } );
			this.list.insert( { cid: 'li1' } );
			this.list.insert( { cid: 'li2' } );
			this.list.insert( { cid: 'li3' } );

			var removeData;
			this.list.bindEvent( 'onRemoveElement', function( data ) {
				removeData = data;
			} );
			
			Assert.areEqual( 4, $( '.list > li' ).length, 'correct number of start items' );
			Assert.areEqual( 1, $( '.list > #li0' ).length, 'check for #li0' );
			Assert.areEqual( 1, $( '.list > #li1' ).length, 'check for #li1' );
			Assert.areEqual( 1, $( '.list > #li2' ).length, 'check for #li2' );
			Assert.areEqual( 1, $( '.list > #li3' ).length, 'check for #li3' );
			
			this.list.remove( 0 );
			Assert.areEqual( 3, $( '.list > li' ).length, 'remove index 0' );
			Assert.areEqual( 0, $( '.list > #li0' ).length, 'remove index 0' );


			Assert.areEqual( 0, removeData.index, 'onRemoveElement data index correct' );
			Assert.isNotUndefined( 0, removeData.rowElement, 'onRemoveElement data rowElement exists' );
			
			this.list.remove( 1 );
			Assert.areEqual( 2, $( '.list > li' ).length, 'remove index 1' );
			Assert.areEqual( 0, $( '.list > #li2' ).length, 'remove index 1 correctly removes #li2' );
			
			this.list.remove( -1 );
			Assert.areEqual( 1, $( '.list > li' ).length, 'remove index -1' );
			Assert.areEqual( 0, $( '.list > #li3' ).length, 'remove index -1 correctly removes #li3' );
			
			Assert.areEqual( 1, $( '.list > #li1' ).length, '#li1 still remains' );
		},
		
		testGetCount: function() {
			var count = this.list.getCount();
			Assert.areEqual( 0, count, 'List is empty' );
			
			this.list.insert( {} );

			count = this.list.getCount();
			Assert.areEqual( 1, count, 'List has 1 element' );
		},
		
		testClear: function() {
			this.list.insert( {} );
			
			Assert.areNotEqual( '', $( '.list' ).html(), 'list has contents' );

			this.list.clear();
			
			Assert.areEqual( '', $( '.list' ).html(), 'list has been cleared' );
		},
        
        testInternalListElementFactory: function() {
            $( '.list' ).empty();
            
			var list = AFrame.construct( {
				type: AFrame.List,
				config: {
					target: '.list'
				}
			} );
            
            list.insert( {} );
            list.insert( {} );
        
            Assert.areEqual( 2, $( '.list li' ).length, 'insert happens with default factory' );
        }
	} );

	TestRunner.add( test );
} );
    