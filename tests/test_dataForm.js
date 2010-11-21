testsToRun.push( function testForm( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.Form",
		
		setUp: function() {
			this.dataSource = AFrame.DataContainer( {
				name: 'AFrame'
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

			Assert.areEqual( 'AFrame', this.dataSource.get( 'name' ), 'dataSource has not been updated before save' );
						
			this.form.save();
			
			Assert.areEqual( 'Charlotte', this.dataSource.get( 'name' ), 'dataSource updated after save' );
		}
		
		
	} );
	
	TestRunner.add( test );	
} );