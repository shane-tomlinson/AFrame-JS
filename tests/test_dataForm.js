testsToRun.push( {
		
		name: "TestCase AFrame.DataForm with DataContainer",
		
		setUp: function() {
			this.dataSource = AFrame.DataContainer( {
				name: 'AFrame',
				field2: 'Field2'
			} );
			
			this.form = AFrame.construct( {
				type: AFrame.DataForm,
				config: {
					target: '#AFrame_Form',
					formFieldFactory: function( formElement ) {
						this.factoryFormElement = formElement;
						this.field = AFrame.construct( {
							type: AFrame.Field,
							config: {
								target: formElement
							}
						} );
						
						return this.field;
					}.bind( this ),
					dataSource: this.dataSource
				}
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
			this.dataSource = AFrame.construct( {
				type: AFrame.Model,
				config: {
					schema: {
						name: { type: 'text' },
						field2: { type: 'text' } 
					},
					data: {
			   		    name: 'AFrame',
						field2: 'Field2'
				 	}
				}
			} );
			
			this.form = AFrame.construct( {
				type: AFrame.DataForm,
				config: {
					target: '#AFrame_Form',
					formFieldFactory: function( formElement ) {
						this.factoryFormElement = formElement;
						this.field = AFrame.construct( {
							type: AFrame.Field,
							config: {
								target: formElement
							}
						} );
						
						return this.field;
					}.bind( this ),
					dataSource: this.dataSource
				}
			} );
		},
		
		tearDown: function() {
			this.form.teardown();
			this.form = null;
		},
		
		testCheckValidity: function() {
			this.field.set( 1 );

			Assert.areSame( 'Field2', this.dataSource.get( 'field2' ), 'dataSource has not been updated before save' );
			
			var valid = this.form.checkValidity();
			Assert.isFalse( valid, 'trying to set text field to an integer, dies.' );

		    var validityState = this.field.getValidityState();
		    Assert.isFalse( validityState.valid, 'setting text field to integer is invalid' );
		    Assert.isTrue( validityState.typeMismatch, 'setting text field to integer causes typeMismatch to be set' );

		    this.field.set( 'Charlotte is the best wife in the world' );
			var valid = this.form.checkValidity();
			
			Assert.isTrue( valid, 'set text field to text, all valid.' );
		    
		},
        
        testCheckValiditySimulateTyping: function() {
            
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
        }
		
} );
