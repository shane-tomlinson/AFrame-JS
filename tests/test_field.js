testsToRun.push( function testField( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.Field",
		
		setUp: function() {
			var target = $( 'input[data-field=name]' );
			this.field = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target
				}
			} );
		},

		tearDown: function() {
			this.field.clear();
			this.field.teardown();
			this.field = null;
		},

		testInput: function() {
			var target = $( 'input[data-field=name]' );
			
			this.field.set( 'Preston the Penguin' );
			Assert.areEqual( 'Preston the Penguin', target.val(), 'element value correctly set when field updated' );
		},

		testText: function() {
			var target = $( 'span[data-field=name]' );
			var textField = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target
				}
			} );
			
			textField.set( 'Shane Tomlinson' );
			Assert.areEqual( 'Shane Tomlinson', target.html(), 'element value correctly set when field updated' );
			
			Assert.areEqual( 'Shane Tomlinson', textField.get(), 'get works correctly on an HTML field' );
			
			textField.clear();
			textField.teardown();
		},

		testTextArea: function() {
			var target = $( 'textarea[data-field=name]' );
			var textAreaField = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target
				}
			} );
			textAreaField.set( 'Charlotte Tomlinson' );
			Assert.areEqual( 'Charlotte Tomlinson', target.val(), 'element value correctly set when field updated' );
			
			textAreaField.clear();
			textAreaField.teardown();
		},

		testValidate: function() {
			var target = $( 'span[data-field=name]' );
			var textField = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target
				}
			} );

			var isValid = textField.validate();
			Assert.isTrue( isValid, 'default validator returns true' );

			textField.teardown();
			textField = null;
			
			target = $( 'textarea[data-field=name]' );
			var fieldValueRequired = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target
				}
			} );

			fieldValueRequired.clear();
			isValid = fieldValueRequired.validate();
			Assert.isFalse( isValid, 'field was required' );

			fieldValueRequired.teardown();
			fieldValueRequired = null;
		},

		testClear: function() {
			var target = $( 'input[data-field=name]' );
			target.val( 'Charlotte Tomlinson' );

			this.field.clear();

			Assert.areEqual( '', target.val(), 'field has been cleared' );
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
		
		testReset: function() {
			var target = $( 'input[data-field=name]' );
			
			this.field.set( 'Charlotte' );
			target.val( 'Shane' );
			this.field.reset();
			Assert.areEqual( 'Charlotte', this.field.get(), 'reset was successful' );
		},
		
		testSave: function() {
			var target = $( 'input[data-field=name]' );
			
			target.val( 'Shane' );
			this.field.save();
			target.val( 'Charlotte' );
			this.field.reset();
			Assert.areEqual( 'Shane', this.field.get(), 'save was successful' );
		},
		
		testFieldWithInitialValue: function() {
			var target = $( 'span[data-field=name]' );
			target.html( 'Charlotte Tomlinson' );
			
			var textField = AFrame.construct( {
				type: 'AFrame.Field',
				config: {
					target: target
				}
			} );

			Assert.areSame( 'Charlotte Tomlinson', textField.get(), 'field with initial value does correct get' );
			
			target.html( 'Shane Tomlinson' );
			
			textField.reset();
			Assert.areSame( 'Charlotte Tomlinson', textField.get(), 'field with initial value resets correctly' );
			
			
		}
	} );

	TestRunner.add( test );
} );
