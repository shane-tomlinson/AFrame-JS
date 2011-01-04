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
        },

        testGetCriteria: function() {
            var target = $( '<input id="createdField" />' ).appendTo( $( 'body' ) );
            var field = AFrame.construct( {
                type: AFrame.Field,
                config: {
                    target: target
                }
            } );

            var validation = AFrame.construct( {
                type: AFrame.FieldPluginValidation
            } );
            validation.setPlugged( field );
            
            var criteria = validation.getCriteria();
            Assert.areEqual( 'text', criteria.type, 'input with no type sets type to text' );

            Assert.isUndefined( criteria.min, 'min not set' );
			target.attr( 'min', 10 );
            criteria = validation.getCriteria();
            Assert.areEqual( 10, criteria.min, 'min set on criteria' );

			
            Assert.isUndefined( criteria.max, 'max not set' );
			target.attr( 'max', 100 );
            criteria = validation.getCriteria();
            Assert.areEqual( 100, criteria.max, 'max set on criteria' );

			
            Assert.isUndefined( criteria.required, 'required not set' );
			target.attr( 'required', '' );
            criteria = validation.getCriteria();
            Assert.isTrue( criteria.required, 'required set on criteria' );
			

            Assert.isUndefined( criteria.step, 'step not set' );
			target.attr( 'step', .25 );
            criteria = validation.getCriteria();
            Assert.areEqual( .25, criteria.step, 'step set on criteria' );


            Assert.isUndefined( criteria.maxlength, 'maxlength not set' );
			target.attr( 'maxlength', '15' );
            criteria = validation.getCriteria();
            Assert.areEqual( 15, criteria.maxlength, 'maxlength set on criteria' );

            Assert.isUndefined( criteria.pattern, 'pattern not set' );
			target.attr( 'pattern', 'abc' );
            criteria = validation.getCriteria();
            Assert.areEqual( 'abc', criteria.pattern, 'pattern set on criteria' );
            
        }
    } );
	TestRunner.add( test );
} );
