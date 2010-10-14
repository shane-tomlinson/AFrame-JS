function testList( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.List",
		
		setUp: function() {
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
					
				}
			} );
		},
		
		tearDown : function () {
			$( '#AFrame_List .list' ).html( '' );
			
			this.list.teardown();
			this.list= null;
			delete this.list;
		},

		testInsert: function() {
			this.list.insert( 0, { field: 'fieldValue' } );
			
			Assert.areEqual( 0, this.insertedIndex, 'create function called for correct index' );
			Assert.areEqual( 'fieldValue', this.insertedData.field, 'create function called with correct data' );
			Assert.areEqual( 1, $( 'ul > li#inserted0' ).length, 'list element inserted' );

			this.list.insert( 1, { field: 'fieldValue' } );
			Assert.areEqual( 1, $( 'ul > li#inserted1' ).length, 'second list element inserted' );

			this.list.insert( 1, { id: 'insertedBefore1' } );
			Assert.areEqual( 1, $( 'ul > li#insertedBefore1' ).length, 'third list element inserted' );

			Assert.areEqual( 1, $( 'li#insertedBefore1 + li#inserted1' ).length, 'third inserted in correct order' );

			this.list.insert( 10, { id: 'insertedOutOfOrder' } );
			Assert.areEqual( 1, $( 'li#insertedOutOfOrder' ).length, 'out of order insert inserts at end' );

			var insertData;
			this.list.bindEvent( 'onInsert', function( data ) {
				insertData = data;
			} );

			var insertElementData;
			this.list.bindEvent( 'onInsertElement', function( data ) {
				insertElementData = data;
			} );

			this.list.insert( Infinity, { id: 'insertWithObservable' } );
			Assert.areEqual( 'insertWithObservable', insertData.data.id, 'onInsert data set correctly' );
			Assert.isNotUndefined( insertData.index, 'onInsert data index set correctly' );
			Assert.isNotUndefined( insertData.rowElement, 'onInsert rowElement set correctly' );
			
			Assert.isNotUndefined( insertElementData.index, 'onInsertElement data index set correctly' );
			Assert.isNotUndefined( insertElementData.rowElement, 'onInsertElement rowElement set correctly' );
			
		},

		testInsertNegativeIndex: function() {
			this.list.insert( -1, { id: 'insertedAtEnd0' } );
			Assert.areEqual( 0, this.insertedIndex, '-1 inserts at end' );

			this.list.insert( -1, { id: 'insertedAtEnd1' } );
			Assert.areEqual( 1, this.insertedIndex, '-1 inserts second at end' );

			this.list.insert( -2, { id: 'insertedAtEnd3' } );
			Assert.areEqual( 1, this.insertedIndex, '-2 inserts third at 2 from end' );
			
		},

		testInsertElement: function() {
			this.list.insertElement( 0, $( '<li id="insertRowInsert">Insert Row Insert</li>' ) );
			Assert.areEqual( 1, $( 'li#insertRowInsert' ).length, 'insertRow correctly working' );
		},

		testRemove: function() {
			this.list.insert( -1, { id: 'li0' } );
			this.list.insert( -1, { id: 'li1' } );
			this.list.insert( -1, { id: 'li2' } );
			this.list.insert( -1, { id: 'li3' } );

			var removeData;
			this.list.bindEvent( 'onRemoveElement', function( data ) {
				removeData = data;
			} );
			
			Assert.areEqual( 4, $( '#AFrame_List .list > li' ).length, 'correct number of start items' );
			Assert.areEqual( 1, $( '#AFrame_List .list > #li0' ).length, 'check for #li0' );
			Assert.areEqual( 1, $( '#AFrame_List .list > #li1' ).length, 'check for #li1' );
			Assert.areEqual( 1, $( '#AFrame_List .list > #li2' ).length, 'check for #li2' );
			Assert.areEqual( 1, $( '#AFrame_List .list > #li3' ).length, 'check for #li3' );
			
			this.list.remove( 0 );
			Assert.areEqual( 3, $( '#AFrame_List .list > li' ).length, 'remove index 0' );
			Assert.areEqual( 0, $( '#AFrame_List .list > #li0' ).length, 'remove index 0' );


			Assert.areEqual( 0, removeData.index, 'onRemoveElement data index correct' );
			Assert.isNotUndefined( 0, removeData.rowElement, 'onRemoveElement data rowElement exists' );
			
			this.list.remove( 1 );
			Assert.areEqual( 2, $( '#AFrame_List .list > li' ).length, 'remove index 1' );
			Assert.areEqual( 0, $( '#AFrame_List .list > #li2' ).length, 'remove index 1 correctly removes #li2' );
			
			this.list.remove( -1 );
			Assert.areEqual( 1, $( '#AFrame_List .list > li' ).length, 'remove index -1' );
			Assert.areEqual( 0, $( '#AFrame_List .list > #li3' ).length, 'remove index -1 correctly removes #li3' );
			
			Assert.areEqual( 1, $( '#AFrame_List .list > #li1' ).length, '#li1 still remains' );
		}
	} );

	TestRunner.add( test );
}
    