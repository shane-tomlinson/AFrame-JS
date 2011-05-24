testsToRun.push( {

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

			this.form = AFrame.Form.create( {
                target: '#AFrame_Form',
                formFieldFactory: function( formElement ) {
                    this.factoryFormElement = formElement;

                    return {
                        checkValidity: validate,
                        save: save,
                        reset: reset,
                        clear: clear,
                        teardown: teardown
                    };
                }.bind( this )
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
			var expectedFormElement = jQuery( '#textFormElement2' )[ 0 ];
			Assert.areEqual( expectedFormElement, this.factoryFormElement[ 0 ], 'formElement passed correctly' );
		},

		testValidate: function() {
			Assert.areEqual( 0, this.validateCount, 'field\'s checkValidity has not been called' );

			this.validateReturn = true;
			var valid = this.form.checkValidity();

			Assert.areEqual( true, valid, 'valid correctly returns form is valid' );
			Assert.areEqual( 2, this.validateCount, 'field\'s checkValidity has been called' );

			this.validateReturn = false;/*{
				field: this,
				error: 'some error'
			};*/
			this.validateCount = 0;
			valid = this.form.checkValidity();
			Assert.isFalse( valid, 'valid correctly returns form is invalid as object return value' );
			/*Assert.areEqual( this.validateReturn, valid, 'valid correctly returns checkValidityReturn' );
			Assert.areEqual( 1, this.validateCount, 'validate has been called once' );
			*/
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
			var field = this.form.bindFormElement( '#formElement' );
			Assert.isNotUndefined( field, 'field was created' );
		},

        testDefaultFieldFactory: function() {
			var form = AFrame.Form.create( {
                target: '#AFrame_Form'
			} );
			var field = form.bindFormElement( '#formElement' );

            Assert.isTrue( field instanceof AFrame.Field, 'default field factory creates a field' );
        },

        testOverrideFormFactory: function() {
            var overriddenFactoryCalled = false;
            AFrame.Form.setDefaultFieldFactory( function( element ) {
                overriddenFactoryCalled = true;
            } );

			var form = AFrame.Form.create( {
                target: '#AFrame_Form'
			} );
			form.bindFormElement( '#formElement' );

            Assert.isTrue( overriddenFactoryCalled, 'overridden factory called' );
        }
} );
