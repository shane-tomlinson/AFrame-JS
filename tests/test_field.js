testsToRun.push( function testField( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.Field",
		
		setUp: function() {
			this.dataContainer = AFrame.construct( {
				type: 'AFrame.DataContainer',
				config: {
					data: {
						name: 'Shane Tomlinson'
					}
				}
			} );


		},

		tearDown: function() {
			this.field.teardown();
			this.field = null;
		},

		testInput: function() {
			var target = $( 'input[data-field=name]' );
			this.field = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target,
					dataContainer: this.dataContainer,
					fieldName: 'name'
				}
			} );

			Assert.areEqual( 'Shane Tomlinson', target.val(), 'input element value correctly set' );

			this.dataContainer.set( 'name', 'Charlotte Tomlinson' );
			Assert.areEqual( 'Charlotte Tomlinson', target.val(), 'element value correctly set when dataContainer updated' );

			this.field.set( 'Preston the Penguin' );
			Assert.areEqual( 'Preston the Penguin', target.val(), 'element value correctly set when field updated' );
			Assert.areEqual( 'Preston the Penguin', this.dataContainer.get( 'name' ), 'dataContainer value correctly set when dataContainer updated' );

			target.val( 'beezlebub' );
			target.trigger( 'change' );
			Assert.areEqual( 'beezlebub', this.dataContainer.get( 'name' ), 'dataContainer value correctly set value typed into field' );
			
		},

		testText: function() {
			var target = $( 'span[data-field=name]' );
			this.field = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target,
					dataContainer: this.dataContainer,
					fieldName: 'name'
				}
			} );
			
			Assert.areEqual( 'Shane Tomlinson', target.html(), 'input element value correctly set' );
			
			this.dataContainer.set( 'name', 'Charlotte Tomlinson' );
			Assert.areEqual( 'Charlotte Tomlinson', target.html(), 'element value correctly set when dataContainer updated' );
			
			this.field.set( 'Preston the Penguin' );
			Assert.areEqual( 'Preston the Penguin', target.html(), 'element value correctly set when field updated' );
			Assert.areEqual( 'Preston the Penguin', this.dataContainer.get( 'name' ), 'dataContainer value correctly set when dataContainer updated' );
		},

		testTextArea: function() {
			var target = $( 'textarea[data-field=name]' );
			this.field = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target,
					dataContainer: this.dataContainer,
					fieldName: 'name'
				}
			} );
			
			Assert.areEqual( 'Shane Tomlinson', target.val(), 'input element value correctly set' );
			
			this.dataContainer.set( 'name', 'Charlotte Tomlinson' );
			Assert.areEqual( 'Charlotte Tomlinson', target.val(), 'element value correctly set when dataContainer updated' );
			
			this.field.set( 'Preston the Penguin' );
			Assert.areEqual( 'Preston the Penguin', target.val(), 'element value correctly set when field updated' );
			Assert.areEqual( 'Preston the Penguin', this.dataContainer.get( 'name' ), 'dataContainer value correctly set when dataContainer updated' );

			target.val( 'beezlebub' );
			target.trigger( 'change' );
			Assert.areEqual( 'beezlebub', this.dataContainer.get( 'name' ), 'dataContainer value correctly set value typed into field' );
		}
	} );

	TestRunner.add( test );
} );
