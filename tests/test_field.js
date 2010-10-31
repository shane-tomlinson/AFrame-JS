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

			var target = $( 'input[data-field=name]' );
			this.field = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target,
					dataContainer: this.dataContainer,
					fieldName: 'name'
				}
			} );
		},

		tearDown: function() {
			this.field.teardown();
			this.field = null;
		},

		testInput: function() {
			var target = $( 'input[data-field=name]' );
			
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
			var textField = AFrame.construct( {
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
			
			textField.set( 'Preston the Penguin' );
			Assert.areEqual( 'Preston the Penguin', target.html(), 'element value correctly set when field updated' );
		},

		testTextArea: function() {
			var target = $( 'textarea[data-field=name]' );
			var textAreaField = AFrame.construct( {
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
			
			textAreaField.set( 'Preston the Penguin' );
			Assert.areEqual( 'Preston the Penguin', target.val(), 'element value correctly set when field updated' );

			target.val( 'beezlebub' );
			target.trigger( 'change' );
			Assert.areEqual( 'beezlebub', this.dataContainer.get( 'name' ), 'dataContainer value correctly set value typed into field' );
		},

		testValidate: function() {
			var target = $( 'span[data-field=name]' );
			var textField = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target,
					dataContainer: this.dataContainer,
					fieldName: 'name'
				}
			} );

			var isValid = textField.validate();
			Assert.areEqual( true, isValid, 'default validator returns true' );

			textField.teardown();
			textField = null;
			
			target = $( 'textarea[data-field=name]' );
			var fieldValueRequired = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target,
					dataContainer: this.dataContainer,
					fieldName: 'name'
				}
			} );

			this.dataContainer.set( 'name', '' );

			isValid = fieldValueRequired.validate();
			Assert.areEqual( false, isValid, 'field was required' );

			fieldValueRequired.teardown();
			fieldValueRequired = null;
		},

		testClear: function() {
			var target = $( 'input[data-field=name]' );
			this.dataContainer.set( 'name', 'Charlotte Tomlinson' );

			this.field.clear();

			Assert.areEqual( '', target.val(), 'field has been cleared' );
			Assert.areEqual( 'Charlotte Tomlinson', this.dataContainer.get( 'name' ), 'store is not affected' );
		},

		testSet: function() {
			var target = $( 'input[data-field=name]' );
			this.field.set( 'AFrame' );
			Assert.areEqual( 'AFrame', target.val(), 'set sets the field correctly' );
		},
		
		testGet: function() {	
			var target = $( 'input[data-field=name]' );
			this.field.set( 'Shane Tomlinson' );
			Assert.areEqual( 'Shane Tomlinson', this.field.get(), 'get gets field correctly' );
		},

		testSave: function() {
			this.dataContainer.set( 'name', 'Preston' );
			this.field.set( 'Charlotte' );

			Assert.areEqual( 'Preston', this.dataContainer.get( 'name' ), 'dataContainer has not been updated' );
			
			this.field.save();
			Assert.areEqual( 'Charlotte', this.dataContainer.get( 'name' ), 'dataContainer has been updated' );
		},

		testReset: function() {
			var target = $( 'input[data-field=name]' );
			
			this.dataContainer.set( 'name', 'Shane' );
			this.field.set( 'Charlotte' );
			this.field.reset();
			Assert.areEqual( 'Shane', this.field.get(), 'reset was successful' );
		}
	} );

	TestRunner.add( test );
} );
