(function(){
    var schemaConfig = {
        stringField: { type: 'text', def: 'stringField Default Value' },
        numberField: { type: 'number' },
        integerField: { type: 'integer' },
        isodatetime: { type: 'iso8601' }
    };

	var ModelClass = AFrame.Model.extend( {
		schema: schemaConfig
	} );


    testsToRun.push( {

		name: "TestCase AFrame.Model",

		setUp: function() {
		    this.model = ModelClass.create();
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

        testSetInvalidTypeForced: function() {
            var fieldValidityState = this.model.set( 'numberField', 'error causing string', true );

            Assert.areSame( 'error causing string', this.model.get( 'numberField' ), 'numberField forcing set' );
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

        },

        testInitialData: function() {

        },

        testToSerializedJSON: function() {
            this.model.set( 'stringField', 'a field' );
            this.model.set( 'numberField', 1.25 );
            this.model.set( 'integerField', 1 );
            this.model.set( 'isodatetime', new Date() );

            var serializedItems = this.model.toSerializedJSON();

            Assert.areEqual( 'a field', serializedItems.stringField, 'stringField is good' );
            Assert.areEqual( 1.25, serializedItems.numberField, 'numberField is good' );
            Assert.areEqual( 1, serializedItems.integerField, 'integerField is good' );
            Assert.isString( serializedItems.isodatetime, 'isodatetime is good' );
        },

        testDeserializeItemsOnCreation: function() {

            var initialData = {
                stringField: 'string value',
                numberField: '1.25',
                integerField: '1',
                isodatetime: '2011-01-16T11:47:04Z'
            };

		    var model = ModelClass.create( {
                data: initialData
            } );

            Assert.areSame( 'string value', model.get( 'stringField' ), 'stringField deserialize OK' );
            Assert.areSame( 1.25, model.get( 'numberField' ), 'numberField deserialized' );
            Assert.areSame( 1, model.get( 'integerField' ), 'integerField deserialized' );

            Assert.isTrue( model.get( 'isodatetime' ) instanceof Date, 'isodatetime deserialized' );

        },

        testCreateModelManually: function() {
            var initialData = {
                stringField: 'string value'
            };

        	var model = AFrame.Model.create( {
        		schema: schemaConfig,
        		data: initialData
        	} );

            Assert.areSame( 'string value', model.get( 'stringField' ), 'Using manually created model to get stringField' );
        },

        testBulkSet: function() {
         	var initialData = {
                stringField: 'string value'
            };

        	var model = AFrame.Model.create( {
        		schema: schemaConfig,
        		data: initialData
        	} );

			model.set( {
				numberField: 1.25,
				integerField: 1.33,
				extraField: 'asdf'
			} );

			Assert.areSame( 1.25, model.get( 'numberField' ), 'numberField is set' );
			Assert.isUndefined( model.get( 'integerField' ), 'integerField is not set' );
			Assert.areSame( 'asdf', model.get( 'extraField' ), 'extraField is set' );
        }


    } );
})();
