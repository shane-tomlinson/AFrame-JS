testsToRun.push( {
		
		name: "TestCase AFrame.Field",
		
		setUp: function() {
			this.field = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: 'input[data-field=name]'
				}
			} );
		},

		tearDown: function() {
			this.field.clear();
			this.field.teardown();
			this.field = null;
		},

		testInput: function() {
			var target = jQuery( 'input[data-field=name]' );
			
			this.field.set( 'Preston the Penguin' );
			Assert.areEqual( 'Preston the Penguin', target.val(), 'element value correctly set' );
			
			this.field.display( 'Charlotte' );
			Assert.areEqual( 'Charlotte', target.val(), 'element value correctly displayed' );
			
			this.field.reset();
			Assert.areEqual( 'Preston the Penguin', target.val(), 'element value correctly reset' );
		},

		testText: function() {
			var target = jQuery( 'span[data-field=name]' );
			var textField = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: 'span[data-field=name]'
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
			var target = jQuery( 'textarea[data-field=name]' );
			var textAreaField = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: 'textarea[data-field=name]'
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
			var target = jQuery( 'span[data-field=name]' );
			var textField = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: 'span[data-field=name]'
				}
			} );

			var isValid = textField.checkValidity();
			Assert.isTrue( isValid, 'default validator returns true' );

			var validity = textField.getValidityState();
			Assert.isTrue( validity.valid, 'validities valid is true' );
			
			textField.teardown();
			textField = null;
			
			target = jQuery( 'textarea[data-field=name]' );
			var fieldValueRequired = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: 'textarea[data-field=name]'
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
			var target = jQuery( 'input[data-field=name]' );
			target.val( 'Charlotte Tomlinson' );

			this.field.clear();

			Assert.areEqual( '', target.val(), 'field has been cleared' );
		},

		testSet: function() {
			var target = jQuery( 'input[data-field=name]' );
			this.field.set( 'AFrame' );
			Assert.areEqual( 'AFrame', target.val(), 'set sets the field correctly' );
		},
		
		testGet: function() {	
			var target = jQuery( 'input[data-field=name]' );
			this.field.set( 'Shane Tomlinson' );
			Assert.areEqual( 'Shane Tomlinson', this.field.get(), 'get gets field correctly' );

			target.val( 'Shane' );
			Assert.areEqual( 'Shane', this.field.get(), 'get gets field correctly whenever setting val outside of set' );
            
		},
		
		testReset: function() {
			var target = jQuery( 'input[data-field=name]' );
			
			this.field.set( 'Charlotte' );
			target.val( 'Shane' );
			this.field.reset();
			Assert.areEqual( 'Charlotte', this.field.get(), 'reset was successful' );
		},
		
		testSave: function() {
			var target = jQuery( 'input[data-field=name]' );
			
			target.val( 'Shane' );
			this.field.save();
			target.val( 'Charlotte' );
			this.field.reset();
			Assert.areEqual( 'Shane', this.field.get(), 'save was successful' );
		},
		
		testFieldWithInitialValue: function() {
			var target = jQuery( 'span[data-field=name]' );
			target.html( 'Charlotte Tomlinson' );
			
			var textField = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: 'span[data-field=name]'
				}
			} );

			Assert.areSame( 'Charlotte Tomlinson', textField.get(), 'field with initial value does correct get' );
			
			target.html( 'Shane Tomlinson' );
			
			textField.reset();
			Assert.areSame( 'Charlotte Tomlinson', textField.get(), 'field with initial value resets correctly' );
		},
		
		testGetDisplayed: function() {
			var target = jQuery( 'input[data-field=name]' );
			
			this.field.set( 'Preston the Penguin' );
			Assert.areEqual( 'Preston the Penguin', this.field.getDisplayed(), 'getDisplayed works' );
			
			this.field.display( 'Charlotte' );
			Assert.areEqual( 'Charlotte', target.val(), 'element value correctly displayed' );
			Assert.areEqual( 'Charlotte', this.field.getDisplayed(), 'getDisplayed returns same data as target.val' );
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
			var target = jQuery( 'textarea[data-field=name]' );
			
			var fieldValueRequired = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: 'textarea[data-field=name]'
				}
			} );

			
			var defaultPrevented = false;
			AFrame.DOM.bindEvent( 'textarea[data-field=name]', 'invalid', function( event ) {
				defaultPrevented = event.isDefaultPrevented && event.isDefaultPrevented();
			} );
			
			// We cancel the browser handle the invalid event, no browser will show the error message
            // default is the to cancel the event.
            AFrame.DOM.fireEvent( 'textarea[data-field=name]', 'invalid' );
			
			Assert.isTrue( defaultPrevented, 'with AFrame.Field.cancelInvalid = true, invalid\'s default is prevented' );

			// We let the browser handle the invalid event, some browsers show an error message.
			AFrame.Field.cancelInvalid = false;
			AFrame.DOM.fireEvent( 'textarea[data-field=name]', 'invalid' );
			
			Assert.isFalse( defaultPrevented, 'with AFrame.Field.cancelInvalid = false, invalid occurs normally' );
            AFrame.Field.cancelInvalid = true;

		},
        
        testSetCausesInvalid: function() {
			var target = jQuery( 'textarea[data-field=name]' );
			
			var field = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: 'textarea[data-field=name]'
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
