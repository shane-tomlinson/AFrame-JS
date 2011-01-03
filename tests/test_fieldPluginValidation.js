testsToRun.push( function testField( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.FieldPluginValidation",
		
		setUp: function() {
			target = $( 'textarea[data-field=name]' );
			
			this.field = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: target,
				}
			} );
            
            
        },
        tearDown: function() {
            this.field.teardown();
            this.field = null;
        },
        
        testGetValidityState: function() {
            var validityState = this.field.getValidityState();
            Assert.isTrue( validityState instanceof AFrame.FieldValidityState, 'getValidityState returns a FieldValidityState' );
        },
        
        testValidateValueMissing: function() {
            this.field.set( 'value' );
            var isValid = this.field.validate();
            
            Assert.isTrue( isValid, 'field is currently valid' );

            this.field.set( '' );
            isValid = this.field.validate( this.field );
            
            Assert.isFalse( isValid, 'field is invalid, missing value' );
            
            var validityState = this.field.getValidityState( this.field );
            Assert.isTrue( validityState.valueMissing, 'valueMissing set to true' );
        },
        
        testValidatorAddedAsPlugin: function() {
            var ourValidatorCalled = false;
            
            function ValidatorPlugin() {
                ValidatorPlugin.superclass.constructor.call( this );
            }
            AFrame.extend( ValidatorPlugin, AFrame.FieldPluginValidation, {
                validate: function() {
                    ourValidatorCalled = true;
                }
            } );
            
            var field = AFrame.construct( {
                type: AFrame.Field,
                config: {
                    target: $( 'textarea[data-field=name]' )
                },
                plugins: [ {
                    type: ValidatorPlugin
                } ]
            } );
            
            field.validate();
            
            Assert.isTrue( ourValidatorCalled, 'plugin validator correctly overrides inline validator' );
        },
        
        testInvalidEvent: function() {
			var target = $( 'textarea[data-field=name]' );
			target.val( '' );
            
			var field = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: target
				}
			} );
            
            var invalidTriggered = false;
            target.bind( 'invalid', function( event ) {
                invalidTriggered = true;
            } );
            
            field.setError( 'fakeError' );
            Assert.isTrue( invalidTriggered, 'setError causes invalid event' );
                        
            invalidTriggered = false;
            field.setCustomValidity( 'custom validity' );
            Assert.isTrue( invalidTriggered, 'setCustomValidity causes invalid event' );
        },
        
        testManualErrorShowsStandardErrors: function() {
			var target = $( 'textarea[data-field=name]' );
			target.val( '' );
            
			var field = AFrame.construct( {
				type: AFrame.Field,
				config: {
					target: target
				}
			} );
            
            field.setError( 'fakeError' );
            
            var validityState = field.getValidityState();
            Assert.isTrue( validityState.valueMissing, 'setError sets the valueMissing field as well.' );
            
            // this resets the errors.
            field.set( '' );
            
            field.setCustomValidity( 'custom validity' );

            var validityState = field.getValidityState();
            Assert.isTrue( validityState.valueMissing, 'setCustomValidity sets the valueMissing field as well.' );
        }  
    } );
	TestRunner.add( test );
} );