testsToRun.push( function test( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var testWithMVCArray = new TestCase( {
		
		name: "TestCase AFrame.ListPluginBindItemsToForm",
		
		setUp: function() {
			this.collection = AFrame.construct( {
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
						type: 'AFrame.ListPluginBindItemsToForm',
						config: {
							collection: this.collection
						}
					}
				]
			} );		
		},
		
		tearDown: function() {
			this.collection.teardown();
			this.list.clear();
			this.list.teardown();
			
			AFrame.remove( this, 'collection' );
			AFrame.remove( this, 'list' );
		},
		
		testFunctionsAdded: function() {
			Assert.isFunction( this.list.reset, 'Reset added' );
			Assert.isFunction( this.list.save, 'Save added' );
			Assert.isFunction( this.list.validate, 'Validate added' );
			Assert.isFunction( this.list.clear, 'Clear added' );
		},
		
		testReset: function() {
			
		},
		
		testSave: function() {
			
		},
		
		testValidate: function() {
			
		},
		
		testClear: function() {
			
		}
		
		
		
	} );

	TestRunner.add( testWithMVCArray );
} );