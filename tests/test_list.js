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
		}
	} );

	TestRunner.add( test );
}
    