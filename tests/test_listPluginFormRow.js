testsToRun.push( {
		
		name: "TestCase AFrame.ListPluginFormRow",
		
		setUp: function() {
			this.list = AFrame.create( AFrame.List, {
                target: '.list',
                listElementFactory: function( data, index ) {
                    this.insertedIndex = index;
                    this.insertedData = data;
                    var rowElement = AFrame.DOM.createElement( 'li', '<span data-field name="fieldName"></span>' );
                    AFrame.DOM.setAttr( rowElement, 'id', ( data.cid ? data.cid : 'inserted' + index ) );
                    return rowElement;
                }.bind( this ),
					
				plugins: [ [ AFrame.ListPluginFormRow, {
							formFactory: function( rowElement, data ) {
								this.form = {
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
									}.bind( this ),
                                    
                                    teardown: function() {}
								};
								
                                this.form.data = data;
                                
								return this.form;
							}.bind( this )
						}
					] ]
			} );		
		},
		
		tearDown: function() {
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
		
        testFormFormFactoryDataCorrect: function() {
            var data = {
                cid: 'cid0'
            };
            this.list.insert( data );
            Assert.areSame( data, this.form.data, 'data is good' );
        },
        
		testReset: function() {
			this.list.insert( {
				cid: 'cid0'
			}, 0 );
			
			this.form.resetTest();
			this.list.reset();
			
			Assert.isTrue( this.resetCalled, 'Field\'s reset has been called' );
		},
		
		testSave: function() {
			this.list.insert( {
				cid: 'cid0'
			}, 0 );
			
			this.form.resetTest();
			this.list.save();
			
			Assert.isTrue( this.saveCalled, 'Field\'s save has been called' );
		},
		
		testValidate: function() {
			this.list.insert( {
				cid: 'cid0'
			}, 0);
			
			this.form.resetTest();
			this.list.validate();
			
			Assert.isTrue( this.validateCalled, 'Field\'s validate has been called' );
			
			this.form.resetTest();
			
			this.list.validate( 0 );
			Assert.isTrue( this.validateCalled, 'Field\'s validate has been called' );
			
			this.form.resetTest();
			
			this.list.validate( 1 );
			Assert.isFalse( this.validateCalled, 'Field\'s validate was not called' );
			
			this.form.resetTest();
		},
		
		testClear: function() {
			this.list.insert( {
				cid: 'cid0'
			}, 0 );

			this.form.resetTest();
			this.list.clear();
			
			Assert.isTrue( this.clearCalled, 'Field\'s clear has been called' );			
		},
        
        testDefaultFormFactory: function() {
            var list = AFrame.create( AFrame.List, {
                target: '.list',
                plugins: [ AFrame.ListPluginFormRow ]
            } );
            
            // Just make sure we don't blow our tops.
            list.insert( {
                name: 'AFrame'
            } );
            
            var form = list.getForm( 0 );
            Assert.isTrue( form instanceof AFrame.Form, 'default form returned, is of type form'  );
        }
		
} );
