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
        }
    } );
	TestRunner.add( test );
} );