testsToRun.push( {

		name: "TestCase AFrame.DataForm with DataContainer",

		setUp: function() {
			this.dataSource = AFrame.DataContainer.create( {
                data: {
                    name: 'AFrame',
                    field2: 'Field2'
                } } );

			this.form = AFrame.DataForm.create( {
                target: '#AFrame_Form',
                formFieldFactory: function( formElement ) {
                    this.factoryFormElement = formElement;
                    this.field = AFrame.Field.create( {
                        target: formElement
                    } );

                    return this.field;
                }.bind( this ),
                dataSource: this.dataSource
			} );
		},

		tearDown: function() {
			this.form.teardown();
			this.form = null;
		},

		testBindToDataSource: function() {
			Assert.areEqual( 'AFrame', jQuery( '#textFormElement' ).html(), 'field bound to data source' );
		},

		testUpdateDataSource: function() {
			this.dataSource.set( 'name', 'Shane' );
			Assert.areEqual( 'Shane', jQuery( '#textFormElement' ).html(), 'field updated when store updated' );
		},

		testSave: function() {
			this.field.set( 'Charlotte' );

			Assert.areEqual( 'Field2', this.dataSource.get( 'field2' ), 'dataSource has not been updated before save' );

			this.form.save();

			Assert.areEqual( 'Charlotte', this.dataSource.get( 'field2' ), 'dataSource updated after save' );
		}


} );

testsToRun.push( {

		name: "TestCase AFrame.DataForm with Model",

		setUp: function() {
			this.dataSource = AFrame.Model.create( {
                schema: {
                    name: { type: 'text' },
                    field2: { type: 'text' }
                },
                data: {
                    name: 'AFrame',
                    field2: 'Field2'
                }
			} );

			this.form = AFrame.DataForm.create( {
                target: '#AFrame_Form',
                formFieldFactory: function( formElement ) {
                    this.factoryFormElement = formElement;
                    this.field = AFrame.Field.create( {
                        target: formElement
                    } );

                    return this.field;
                }.bind( this ),
                dataSource: this.dataSource
			} );
		},

		tearDown: function() {
			this.form.teardown();
			this.form = null;
		},

		testCheckValidity: function() {
			this.field.set( 'asdf' );

			Assert.areSame( 'Field2', this.dataSource.get( 'field2' ), 'dataSource has not been updated before save' );

			var valid = this.form.checkValidity();
			Assert.isTrue( valid, 'trying to set text field to an integer, dies.' );

		    var validityState = this.field.getValidityState();
		    Assert.isTrue( validityState.valid, 'setting text field to integer is invalid' );
		},

        testValidateFormWithModel: function() {
            var mockValidityCalled = false;
            var modelMock = {
                checkValidity: function() {
                    mockValidityCalled = true;
                    return false;
                }
            };

            this.form.validateFormFieldsWithModel( modelMock );

            Assert.isTrue( mockValidityCalled, 'the mock model\'s checkValidity was called' );
        },

        testSave: function() {
			this.field.set( 'test value' );

			Assert.areSame( 'Field2', this.dataSource.get( 'field2' ), 'dataSource has not been updated before save' );

            this.form.save();
			Assert.areSame( 'test value', this.dataSource.get( 'field2' ), 'dataSource updated after save' );
        }

} );

testsToRun.push( {

		name: "TestCase AFrame.DataForm with autosave",

		setUp: function() {
			this.dataSource = AFrame.DataContainer.create( {
                data: {
                    name: 'AFrame',
                    field2: 'Field2'
                }
			} );

			this.form = AFrame.DataForm.create( {
                autosave: true,
                target: '#AFrame_Form',
                formFieldFactory: function( formElement ) {
                    this.factoryFormElement = formElement;
                    this.field = AFrame.Field.create( {
                        target: formElement
                    } );

                    return this.field;
                }.bind( this ),
                dataSource: this.dataSource
			} );
		},

		tearDown: function() {
			this.form.teardown();
			this.form = null;
		},


        testAutoSaveOnChange: function() {
            this.field.set( 'Charlotte' );

            Assert.areSame( 'Charlotte', this.dataSource.get( 'field2' ), 
                    'field2 is updated' );
        }
} );
