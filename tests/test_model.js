(function(){
    var schemaConfig = {
        stringField: { type: 'text', def: 'stringField Default Value' },
        numberField: { type: 'number' },
        integerField: { type: 'integer' },
        isodatetime: { type: 'iso8601' }
    };
    
    var schema = AFrame.construct( {
        type: AFrame.Schema,
        config: {
            schema: schemaConfig
        }
    } );
    
    testsToRun.push( {
		
		name: "TestCase AFrame.Model",

		setUp: function() {
		    this.model = AFrame.construct( {
                type: AFrame.Model,
                config: {
                    schema: schema
                }
            } );
		},

		tearDown: function() {
		    this.model.teardown();
		    this.model = null;
		},
		
        testGetDefault: function() {
            Assert.areEqual( 'stringField Default Value', this.model.get( 'stringField' ), 'default values set' );
        },

        testSet: function() {
            var retval = this.model.set( 'numberField', 1 );

            Assert.isUndefined( retval, 'numberField previously had no value' );
            Assert.areEqual( 1, this.model.get( 'numberField' ), 'numberField set and gotten correctly' );

            retval = this.model.set( 'numberField', 2 );
            Assert.areEqual( 1, retval, 'previous value returned correctly' );
            Assert.areEqual( 2, this.model.get( 'numberField' ), 'numberField set and gotten correctly' );
            
        },

        testSetInvalidType: function() {
            var fieldValidityState = this.model.set( 'numberField', 'error causing string' );

            Assert.isUndefined( this.model.get( 'numberField' ), 'numberField still undefined' );
            Assert.isTrue( fieldValidityState instanceof AFrame.FieldValidityState, 'numberField still undefined' );
            Assert.isFalse( fieldValidityState.valid, 'setting a number field to a string is invalid' );
        },
        
        testCheckValidity: function() {
            var fieldValidityState = this.model.checkValidity( 'numberField', 'error causing string' );

            Assert.isUndefined( this.model.get( 'numberField' ), 'numberField still undefined, set does not happen' );
            
            Assert.isTrue( fieldValidityState instanceof AFrame.FieldValidityState, 'field was invalid, so we have a fieldValidityState' );
            Assert.isFalse( fieldValidityState.valid, 'setting a number field to a string is invalid' );
            
            fieldValidityState = this.model.checkValidity( 1, 'error causing string' );

            Assert.isUndefined( this.model.get( 'numberField' ), 'numberField still undefined, set does not happen' );
            Assert.areEqual( 'boolean', typeof( fieldValidityState ), 'valid field, boolean returned' );
            
        }
		
	
    } );
})();
