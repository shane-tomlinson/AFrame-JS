testsToRun.push( function testForm( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
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
			Assert.areEqual( 'AFrame', $( '#textFormElement' ).html(), 'field bound to data source' );			
		},
		
		testUpdateDataSource: function() {
			this.dataSource.set( 'name', 'Shane' );
			Assert.areEqual( 'Shane', $( '#textFormElement' ).html(), 'field updated when store updated' );
		},
		
		testSave: function() {
			this.field.set( 'Charlotte' );

			Assert.areEqual( 'Field2', this.dataSource.get( 'field2' ), 'dataSource has not been updated before save' );
						
			this.form.save();
			
			Assert.areEqual( 'Charlotte', this.dataSource.get( 'field2' ), 'dataSource updated after save' );
		}
		
		
	} );
	
	TestRunner.add( test );	
	
	
	test = new TestCase( {
		
		name: "TestCase AFrame.DataForm with Model",
		
		setUp: function() {
			this.schema = AFrame.construct( {
				type: AFrame.Schema,
				config: {
					schema: {
						name: { type: 'text' },
						field2: { type: 'text' } 
					}
				}
			} );
			
			
			
			this.dataSource = AFrame.construct( {
				type: AFrame.Model,
				config: {
					schema: this.schema,
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
		
		testSave: function() {
			this.field.set( 1 );

			Assert.areEqual( 'Field2', this.dataSource.get( 'field2' ), 'dataSource has not been updated before save' );
			
			var valid = this.form.checkValidity();
			
			Assert.isFalse( valid, 'trying to set text field to an integer, dies.' );
		//	Assert.areEqual( 'Charlotte', this.dataSource.get( 'field2' ), 'dataSource updated after save' );
		}
		
		
	} );
	
	TestRunner.add( test );	
} );