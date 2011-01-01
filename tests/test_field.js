testsToRun.push( function testField( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.Field",
		
		setUp: function() {
			var target = $( 'input[data-field=name]' );
			this.field = AFrame.construct( {
				type: AFrame.Field,
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
			Assert.areEqual( 'Preston the Penguin', target.val(), 'element value correctly set' );
			
			this.field.display( 'Charlotte' );
			Assert.areEqual( 'Charlotte', target.val(), 'element value correctly displayed' );
			
			this.field.reset();
			Assert.areEqual( 'Preston the Penguin', target.val(), 'element value correctly reset' );
		},

		testText: function() {
			var target = $( 'span[data-field=name]' );
			var textField = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: target
				}
			} );
			
			textField.set( 'Shane Tomlinson' );
			Assert.areEqual( 'Shane Tomlinson', target.html(), 'element value correctly set when field updated' );
			
			Assert.areEqual( 'Shane Tomlinson', textField.get(), 'get works correctly on an HTML field' );
			
			textField.display( 'Charlotte' );
			Assert.areEqual( 'Charlotte', target.html(), 'element value correctly displayed' );
			
			textField.reset();
			Assert.areEqual( 'Shane Tomlinson', target.html(), 'element value correctly reset' );
			
			textField.clear();
			textField.teardown();
		},

		testTextArea: function() {
			var target = $( 'textarea[data-field=name]' );
			var textAreaField = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: target
				}
			} );
			textAreaField.set( 'Charlotte Tomlinson' );
			Assert.areEqual( 'Charlotte Tomlinson', target.val(), 'element value correctly set when field updated' );

			textAreaField.display( 'Charlotte' );
			Assert.areEqual( 'Charlotte', target.val(), 'element value correctly displayed' );
			
			textAreaField.reset();
			Assert.areEqual( 'Charlotte Tomlinson', target.val(), 'element value correctly reset' );
			
			textAreaField.clear();
			textAreaField.teardown();
		},

		testCheckValidity: function() {
			var target = $( 'span[data-field=name]' );
			var textField = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: target
				}
			} );

			var isValid = textField.checkValidity();
			Assert.isTrue( isValid, 'default validator returns true' );

			var validity = textField.getValidityState();
			Assert.isTrue( validity.valid, 'validities valid is true' );
			
			textField.teardown();
			textField = null;
			
			target = $( 'textarea[data-field=name]' );
			var fieldValueRequired = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: target
				}
			} );

			fieldValueRequired.clear();
			// note that this test checks whether HTML5 validation is working in compatible browsers as well so
			//	there may be different results in browsers supporting HTML5 validation vs those that do not.
			isValid = fieldValueRequired.checkValidity();
			Assert.isFalse( isValid, 'field was required' );

			validity = fieldValueRequired.getValidityState();
			Assert.isFalse( validity.valid, 'validities valid is false' );
			Assert.isTrue( validity.valueMissing, 'value was missing' );
			
			
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
				type: AFrame.Field,
				config: {
					target: target
				}
			} );

			Assert.areSame( 'Charlotte Tomlinson', textField.get(), 'field with initial value does correct get' );
			
			target.html( 'Shane Tomlinson' );
			
			textField.reset();
			Assert.areSame( 'Charlotte Tomlinson', textField.get(), 'field with initial value resets correctly' );
		},
		
		testGetDisplayed: function() {
			var target = $( 'input[data-field=name]' );
			
			this.field.set( 'Preston the Penguin' );
			Assert.areEqual( 'Preston the Penguin', this.field.getDisplayed(), 'getDisplayed works' );
			
			this.field.display( 'Charlotte' );
			Assert.areEqual( 'Charlotte', target.val(), 'element value correctly displayed' );
			Assert.areEqual( 'Charlotte', this.field.getDisplayed(), 'getDisplayed returns same data as target.val' );
			
			Assert.areEqual( 'Preston the Penguin', this.field.get(), 'display nor getDisplayed affect get' );
		},
		
		testSetError: function() {
			this.field.checkValidity();
			
			this.field.setError( 'randomError' );
			
			var validityState = this.field.getValidityState();
			Assert.isFalse( validityState.valid, 'no longer valid' );
			Assert.isTrue( validityState.randomError, 'random error got set' );
			
			this.field.checkValidity();
			validityState = this.field.getValidityState();
			Assert.isFalse( validityState.valid, 'still invalid, no matter how many times we do checkValidity or getValidityState' );
			Assert.isTrue( validityState.randomError, 'randomError is still set' );
            
            this.field.set( 'blue' );
			validityState = this.field.getValidityState();
			Assert.isTrue( validityState.valid, 'valid reset after set' );
			Assert.isUndefined( validityState.randomError, 'randomError reset after set' );
		},
		
		testSetCustomValidity: function() {
			this.field.checkValidity();
			
			this.field.setCustomValidity( 'This is a random error message' );
			
			var validityState = this.field.getValidityState();
			Assert.isFalse( validityState.valid, 'no longer valid' );
			Assert.isTrue( validityState.customError, 'customError is set' );
			Assert.areEqual( 'This is a random error message', validityState.validationMessage, 'validationMessage got set' );
			
            
            this.field.set( 'blue' );

			validityState = this.field.getValidityState();
			Assert.isTrue( validityState.valid, 'valid after set' );
			Assert.isFalse( validityState.customError, 'customError is set' );
			Assert.areEqual( '', validityState.validationMessage, 'after set, validationMessage is reset' );
		},
		
		testInvalidCancellable: function() {
			target = $( 'textarea[data-field=name]' );
			
			var fieldValueRequired = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: target
				}
			} );

			
			var defaultPrevented = false;
			target.bind( 'invalid', function( event ) {
				defaultPrevented = event.isDefaultPrevented();
			} );
			
			// We cancel the browser handle the invalid event, no browser will show the error message
            // default is the to cancel the event.
			target.trigger( 'invalid' );
			
			Assert.isTrue( defaultPrevented, 'with AFrame.Field.cancelInvalid = true, invalid\'s default is prevented' );

			// We let the browser handle the invalid event, some browsers show an error message.
			AFrame.Field.cancelInvalid = false;
			target.trigger( 'invalid' );
			
			Assert.isFalse( defaultPrevented, 'with AFrame.Field.cancelInvalid = false, invalid occurs normally' );
            AFrame.Field.cancelInvalid = true;

		},
        
        testSetCausesInvalid: function() {
			target = $( 'textarea[data-field=name]' );
			
			var field = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: target
				}
			} );
            
            field.set( 'value' );
            var validityState = field.getValidityState();
            
            Assert.isFalse( validityState.valueMissing, 'Field was required, has value, value is not missing' );
            
            // since a value is required, this should cause a validity state error.
            field.set( '' );
            var validityState = field.getValidityState();
            Assert.isTrue( validityState.valueMissing, 'Field was required, does not have a value, getValidityState correctly gets this' );
        }
	} );

	TestRunner.add( test );
} );
