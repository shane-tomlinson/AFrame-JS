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

			target.val( 'beezlebub' );
			target.trigger( 'change' );
			Assert.areEqual( 'beezlebub', this.dataContainer.get( 'name' ), 'dataContainer value correctly set value typed into field' );
		},

		testValidate: function() {
			var target = $( 'span[data-field=name]' );
			this.field = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target,
					dataContainer: this.dataContainer,
					fieldName: 'name'
				}
			} );

			var isValid = this.field.validate();
			Assert.areEqual( true, isValid, 'default validator returns true' );

			target = $( 'textarea[data-field=name]' );
			this.fieldValueRequired = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target,
					dataContainer: this.dataContainer,
					fieldName: 'name'
				}
			} );

			this.dataContainer.set( 'name', '' );

			isValid = this.fieldValueRequired.validate();
			this.fieldValueRequired.teardown();
			this.fieldValueRequired = null;
			Assert.areEqual( false, isValid, 'field was required' );
			
		},

		testClear: function() {
			target = $( 'textarea[data-field=name]' );
			this.field= AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target,
					dataContainer: this.dataContainer,
					fieldName: 'name'
				}
			} );
			
			this.dataContainer.set( 'name', 'Charlotte Tomlinson' );

			this.field.clear();

			Assert.areEqual( '', target.val(), 'field has been cleared' );
			Assert.areEqual( 'Charlotte Tomlinson', this.dataContainer.get( 'name' ), 'store is not affected' );
		},

		testSet: function() {
			target = $( 'textarea[data-field=name]' );
			this.field= AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target,
					dataContainer: this.dataContainer,
					fieldName: 'name'
				}
			} );
			
			this.field.set( 'AFrame' );
			Assert.areEqual( 'AFrame', target.val(), 'set sets the field correctly' );
		},
		
		testGet: function() {	
			target = $( 'textarea[data-field=name]' );
			this.field= AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target,
					dataContainer: this.dataContainer,
					fieldName: 'name'
				}
			} );
			
			this.field.set( 'Shane Tomlinson' );
			Assert.areEqual( 'Shane Tomlinson', this.field.get(), 'get gets field correctly' );
		}
	} );

	TestRunner.add( test );
} );
