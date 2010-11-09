testsToRun.push( function test( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var testWithMVCArray = new TestCase( {
		
		name: "TestCase AFrame.ListPluginFormRow",
		
		setUp: function() {
			this.collection = AFrame.construct( {
				type: 'AFrame.MVCArray'
			} );
			
			this.list = AFrame.construct( {
				type: 'AFrame.List',
				config: {
					target: '#AFrame_List .list',
					createListElementCallback: function( index, data ) {
						this.insertedIndex = index;
						this.insertedData = data;
						var rowElement = $( '<li id="' + ( data.cid ? data.cid : 'inserted' + index ) + 
								'"><span data-field="fieldName"></span></li>' );
						return rowElement;
					}.bind( this )
					
				},
				plugins: [
					{
						type: 'AFrame.ListPluginFormRow',
						config: {
							collection: this.collection,
							formFieldFactory: function( element, collection ) {
								this.field = {
									reset: function() {
										this.resetCalled = true;
									}.bind( this ),
									
									validate: function() {
										this.validateCalled = true;
										return true;
									}.bind( this ),
									
									clear: function() {
										this.clearCalled = true;										
									}.bind( this ),
									
									save: function() {
										this.saveCalled = true;										
									}.bind( this ),
									
									resetTest: function() {
										this.resetCalled = false;
										this.validateCalled = false;
										this.clearCalled = false;
										this.saveCalled = false;
									}.bind( this )
									
								};
								
								return this.field;
							}.bind( this )
						}
					}
				]
			} );		
		},
		
		tearDown: function() {
			this.collection.teardown();
			this.list.clear();
			this.list.teardown();
			
			AFrame.remove( this, 'collection' );
			AFrame.remove( this, 'list' );
		},
		
		testFunctionsAdded: function() {
			Assert.isFunction( this.list.reset, 'Reset added' );
			Assert.isFunction( this.list.save, 'Save added' );
			Assert.isFunction( this.list.validate, 'Validate added' );
			Assert.isFunction( this.list.clear, 'Clear added' );
		},
		
		testReset: function() {
			this.collection.insert( {
				cid: 'cid0'
			} );
			
			this.field.resetTest();
			this.list.reset();
			
			Assert.isTrue( this.resetCalled, 'Field\'s reset has been called' );
		},
		
		testSave: function() {
			this.collection.insert( {
				cid: 'cid0'
			} );
			
			this.field.resetTest();
			this.list.save();
			
			Assert.isTrue( this.saveCalled, 'Field\'s save has been called' );
		},
		
		testValidate: function() {
			this.collection.insert( {
				cid: 'cid0'
			} );
			
			this.field.resetTest();
			this.list.validate();
			
			Assert.isTrue( this.validateCalled, 'Field\'s validate has been called' );
			
			this.field.resetTest();
			
			this.list.validate( 0 );
			Assert.isTrue( this.validateCalled, 'Field\'s validate has been called' );
			
			this.field.resetTest();
			
			this.list.validate( 'cid0' );
			Assert.isTrue( this.validateCalled, 'Field\'s validate has been called' );
			
			this.field.resetTest();

			this.list.validate( 'cid1' );
			Assert.isFalse( this.validateCalled, 'Field\'s validate was not called' );
			
			this.field.resetTest();
			
			this.list.validate( 1 );
			Assert.isFalse( this.validateCalled, 'Field\'s validate was not called' );
			
			this.field.resetTest();
		},
		
		testClear: function() {
			this.collection.insert( {
				cid: 'cid0'
			} );

			this.field.resetTest();
			this.list.clear();
			
			Assert.isTrue( this.clearCalled, 'Field\'s clear has been called' );			
		}
		
		
		
	} );

	TestRunner.add( testWithMVCArray );
} );