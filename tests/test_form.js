testsToRun.push( function testForm( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.Form",
		
		setUp: function() {
			this.validateCount = 0;
			this.validateReturn = true;

			var validate = function() {
				this.validateCount++;
				return this.validateReturn;
			}.bind( this );

			this.saveCount = 0;
			var save = function() {
				this.saveCount++;
			}.bind( this );

			this.resetCount = 0;
			var reset = function() {
				this.resetCount++;
			}.bind( this );

			this.clearCount = 0;
			var clear = function() {
				this.clearCount++;
			}.bind( this );
			
			this.teardownCount = 0;
			var teardown = function() {
				this.teardownCount++;
			}.bind( this );
			
			this.form = AFrame.construct( {
				type: AFrame.Form,
				config: {
					target: '#AFrame_Form',
					formFieldFactory: function( formElement ) {
						this.factoryFormElement = formElement;
						
						return {
							validate: validate,
							save: save,
							reset: reset,
							clear: clear,
							teardown: teardown
						};
					}.bind( this )
				}
			} );
		},
		
		tearDown: function () {
			this.form.teardown();
			this.form = null;
			delete this.form;
		},

		testGetFormElements: function() {
			var formElements = this.form.getFormElements();
			Assert.areEqual( 2, formElements.length, 'formElement was found' );
		},

		testGetFormFields: function() {
			var formFields = this.form.getFormFields();
			Assert.areEqual( 2, formFields.length, 'formField was created' );
		},

		testFactoryPassedWithCorrectData: function() {
			var expectedFormElement = $( '#textFormElement2' )[ 0 ];
			Assert.areEqual( expectedFormElement, this.factoryFormElement[ 0 ], 'formElement passed correctly' );
		},

		testValidate: function() {
			Assert.areEqual( 0, this.validateCount, 'field\'s validate has not been called' );

			this.validateReturn = true;
			var valid = this.form.validate();
			
			Assert.areEqual( true, valid, 'valid correctly returns form is valid' );
			Assert.areEqual( 2, this.validateCount, 'field\'s validate has been called' );

			this.validateReturn = {
				field: this,
				error: 'some error'
			};
			this.validateCount = 0;
			valid = this.form.validate();
			Assert.isObject( valid, 'valid correctly returns form is invalid as object return value' );
			Assert.areEqual( this.validateReturn, valid, 'valid correctly returns validateReturn' );
			Assert.areEqual( 1, this.validateCount, 'validate has been called once' );
		},
		
		testClear: function() {
			Assert.areEqual( 0, this.clearCount, 'clear has not been called yet' );
			this.form.clear();
			Assert.areEqual( 2, this.clearCount, 'clear has been called' );
		},
		
		testReset: function() {
			Assert.areEqual( 0, this.resetCount, 'reset has not been called yet' );
			this.form.reset();
			Assert.areEqual( 2, this.resetCount, 'reset has been called' );
		},
		
		testSave: function() {
			Assert.areEqual( 0, this.saveCount, 'save has not been called yet' );
			
			this.validateReturn = true;
			var valid = this.form.save();

			Assert.areEqual( 2, this.saveCount, 'save has been called' );
			Assert.isTrue( valid, 'form was valid' );
			
			this.validateReturn = false;
			valid = this.form.save();

			Assert.areEqual( 2, this.saveCount, 'form was not valid, save was not called' );
			Assert.isFalse( valid, 'form was not valid' );
		},
		
		testTeardown: function() {
			this.form.teardown();
			Assert.areEqual( 2, this.teardownCount, 'field teardown was called ' );
		},
		
		testBindFormElement: function() {
			var field = this.form.bindFormElement( $( '#formElement' ) );
			Assert.isNotUndefined( field, 'field was created' );
		}
	} );

	
	TestRunner.add( test );
} );
