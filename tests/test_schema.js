(function() {
    var fieldCount = 0;
    testsToRun.push( {
            
            name: "TestCase AFrame.Schema",
            
            setUp: function() {
                var fixupStringField = function( data ) {
                    var fieldValue = this.useFixedValue ? 'modified string field' : data.value;
                    return fieldValue;
                }.bind( this );

                var cleanStringField = function( data ) {
                    var fieldValue = this.useCleanedValue ? 'modified string field' : data.value;
                    return fieldValue;
                }.bind( this );
                
                var defaultString = function() {
                    return 'returned by function';
                };
                
                this.schemaConfig = {
                    stringField: { type: 'string', def: 'stringField Default Value' },
                    stringFieldFixup: { type: 'string', def: 'stringFieldFixup Default Value',
                        fixup: fixupStringField, cleanup: cleanStringField },
                    stringFieldFixupFunc: { type: 'string', def: defaultString },
                    numberField: { type: 'number' },
                    integerField: { type: 'integer' },
                    fixer: { type: 'fixer' },
                    persistence: { type: 'persistencer' },
                    isodatetime: { type: 'iso8601' },
                    noSaveField: { type: 'string', save: false, def: 'this field will not be saved in serializeItems' }
                };

                fieldCount = 0;
                for( var key in this.schemaConfig ) {
                    fieldCount++;
                }
                
                this.schema = AFrame.Schema( this.schemaConfig );
            },
            
            tearDown : function () {
                this.schema = null;
            },

            testSchemaGetDefault: function() {
                var defaultObject = this.schema.getDefaults();

                Assert.areEqual( 'stringField Default Value', defaultObject.stringField, 'Default value set for stringField' );
                Assert.areEqual( 'stringFieldFixup Default Value', defaultObject.stringFieldFixup, 'Default value set for stringFieldFixup' );
                Assert.areEqual( 'returned by function', defaultObject.stringFieldFixupFunc, 'can get default value using function' );
            },

            testGetAppData: function() {
                var fixedData = this.schema.getAppData( {} );
                
                // with no data, should return same as default items unless a fixup function modifies a value
                Assert.areEqual( 'stringField Default Value', fixedData.stringField, 'Default value set for stringField' );
                Assert.areEqual( 'stringFieldFixup Default Value', fixedData.stringFieldFixup, 'Default value set for stringFieldFixup' );
                Assert.areEqual( 'returned by function', fixedData.stringFieldFixupFunc, 'Default func called for stringFieldFixupFunc' );

                
                fixedData = this.schema.getAppData( {
                    stringField: 'this is a string',
                    stringFieldFixup: 'run through fixup',
                    stringFieldFixupFunc: 'default func not used',
                    extraField: 'extra'
                } );

                // all values should be the same as defined, extraField should not be in result set
                Assert.areEqual( 'this is a string', fixedData.stringField, 'specified value used for stringField' );
                Assert.areEqual( 'run through fixup', fixedData.stringFieldFixup, 'specified value used for stringFieldFixup' );
                Assert.areEqual( 'default func not used', fixedData.stringFieldFixupFunc, 'Default func not used if there is already data' );
                Assert.isFalse( fixedData.hasOwnProperty( 'extraField' ), 'extraField is not on object' );

                // make the fixup function modify value
                this.useFixedValue = true;
                fixedData = this.schema.getAppData( {
                    stringFieldFixup: 'should be modified'
                } );
                
                // fixup function modifies data
                Assert.areEqual( 'modified string field', fixedData.stringFieldFixup, 'stringFieldFixup modified correctly' );
            },

            testForEach: function() {
                this.forEachCallbackCallCount = 0;
                this.schema.forEach( function( row, key ) {
                    this.forEachCallbackCallCount++;
                }, this );

                // fixup function modifies data
                Assert.areEqual( fieldCount, this.forEachCallbackCallCount, 'callback called for each' );
            },

            testSerializeItems: function() {
                var persistence = this.schema.serializeItems( {
                    stringField: 'stringField value',
                    stringFieldFixup: 'stringFieldFixup value',
                    extraField: 'extra field',
                    noSaveField: 'field not saved'
                } );

                Assert.areEqual( 'stringField value', persistence.stringField, 'stringField added' );
                Assert.areEqual( 'stringFieldFixup value', persistence.stringFieldFixup, 'stringFieldFixup added' );
                Assert.isUndefined( persistence.extraField, 'extraField not added' );
                Assert.isUndefined( persistence.noSaveField, 'noSaveField not added with the save: false' );

                this.useCleanedValue = true;
                var persistence = this.schema.serializeItems( {
                    stringField: 'stringField value',
                    stringFieldFixup: 'stringFieldFixup value'
                } );
                
                Assert.areEqual( 'stringField value', persistence.stringField, 'stringField added' );
                Assert.areEqual( 'modified string field', persistence.stringFieldFixup, 'fixup function value used' );
                
                Assert.isUndefined( persistence.__SchemaID, 'SchemaID field does not get persisted' );
            },
            
            testNumberTypeFixer: function() {
                var fixedData = this.schema.getAppData( {
                    numberField: '1.25'
                } );
                Assert.areEqual( 1.25, fixedData.numberField, 'converted a float string to number' );
                
                fixedData = this.schema.getAppData( {
                    numberField: '2'
                } );
                Assert.areEqual( 2, fixedData.numberField, 'converted a integer string to number' );
                
                fixedData = this.schema.getAppData( {
                    numberField: 3.25
                } );
                Assert.areEqual( 3.25, fixedData.numberField, 'keep a number a number' );
                
                fixedData = this.schema.getAppData( {
                    numberField: 4
                } );
                Assert.areEqual( 4, fixedData.numberField, 'keep an integer a number' );
                
                fixedData = this.schema.getAppData( {
                    numberField: 'a'
                } );
                Assert.isTrue( isNaN( fixedData.numberField ), 'converting a letter returns NaN' );
                
            },
            
            testIntegerTypeFixer: function() {
                var fixedData = this.schema.getAppData( {
                    integerField: '1.25'
                } );
                Assert.areEqual( 1, fixedData.integerField, 'converted a float string to integer' );
                
                fixedData = this.schema.getAppData( {
                    integerField: '2'
                } );
                Assert.areEqual( 2, fixedData.integerField, 'converted a integer string to integer' );
                
                fixedData = this.schema.getAppData( {
                    integerField: 3.25
                } );
                Assert.areEqual( 3, fixedData.integerField, 'convert a number to an integer' );
                
                fixedData = this.schema.getAppData( {
                    integerField: 4
                } );
                Assert.areEqual( 4, fixedData.integerField, 'keep an integer an integer' );
                
                fixedData = this.schema.getAppData( {
                    integerField: 'a'
                } );
                Assert.isTrue( isNaN( fixedData.integerField ), 'converting a letter returns NaN' );
            },
            
            testAppDataCleaner: function() {
                var fixerValue;
                AFrame.Schema.addDeserializer( 'fixer', function( data ) {
                    fixerValue = data;
                    return 'fixed';
                } );
                
                fixedData = this.schema.getAppData( {
                    fixer: 'value'
                } );
                Assert.areEqual( 'fixed', fixedData.fixer, 'fix function value applied' );
                Assert.areEqual( 'value', fixerValue, 'fix function passed value correctly' );
            },
            
            testFormDataCleaner: function() {
                var persistencerValue;
                AFrame.Schema.addSerializer( 'persistencer', function( data ) {
                    persistencerValue = data;
                    return 'persistence';
                } );
                
                var persistence = this.schema.serializeItems( { 
                    persistence: 'initial' 
                } );
                Assert.areEqual( 'persistence', persistence.persistence, 'new value used' );
                Assert.areEqual( 'initial', persistencerValue, 'persistencer function passed value correctly' );
            },
            
            testISO8601: function() {
                fixedData = this.schema.getAppData( {
                    isodatetime: '2010-06-06T15:30:00.00Z'
                } );
                
                Assert.isTrue( fixedData.isodatetime instanceof Date, 'we have date conversion' );
                
                var now = new Date();
                var persistence = this.schema.serializeItems( { 
                    isodatetime: now 
                } );
                
                Assert.isString( persistence.isodatetime, 'isodatetime converted to string' );
            },
            
            
            testNestedSchema: function() {
                var innerSchemaConfig = {
                    innerField: { type: 'string', def: 'inner value' }
                };
                
                AFrame.Schema.addSchemaConfig( 'inner', innerSchemaConfig );
                
                var outerSchemaConfig = {
                    schemaField: { type: 'inner' }
                };
                AFrame.Schema.addSchemaConfig( 'outer', outerSchemaConfig );
                
                var schema = AFrame.Schema.getSchema( 'outer' );
            
                var data = schema.getAppData( {} );
                
                Assert.isObject( data.schemaField, 'schemaField created' );
                Assert.areEqual( 'inner value', data.schemaField.innerField, 'schemaField.innerField has correct value' );
                
                var persist = schema.serializeItems( {
                    schemaField: {
                        innerField: 'inner there',
                        extraField: 'extra field'
                    }
                } );
                
                Assert.areEqual( 'inner there', persist.schemaField.innerField, 'schemaField.innerField is there' );
                Assert.isUndefined( persist.schemaField.extraField, 'schemaField.extraField is not there' );
                
                persist = schema.serializeItems( {
                    schemaField: {}
                } );
                
                Assert.isObject( persist.schemaField, 'schemaField made it' );
                
                persist = schema.serializeItems( {} );
                
                Assert.isUndefined( persist.schemaField, 'schemaField not there' );
            },
            
            
            
            testHasMany: function() {
                var schemaConfig = {
                    arrayField: { type: 'integer', has_many: true },
                    dateArrayField: { type: 'iso8601', has_many: true }
                }
                
                var schema = AFrame.construct( {
                    type: AFrame.Schema,
                    config: {
                        schema: schemaConfig
                    }
                } );
                
                var data = schema.getAppData( {} );
                
                Assert.isArray( data.arrayField, 'created an array for arrayField' );
                Assert.areEqual( 0, data.arrayField.length, 'array is empty' );
                
                data = schema.getAppData( {
                    arrayField: [ 1.24, 2, 'a' ]
                } );
                
                Assert.areEqual( 3, data.arrayField.length, 'array has length of 3' );
                Assert.areEqual( 1, data.arrayField[ 0 ], 'item converted to integer' );
                Assert.isTrue( isNaN( data.arrayField[ 2 ] ), 'item could not be converted to integer' );
                
                
                data = schema.serializeItems( {
                } );
                
                Assert.isUndefined( data.arrayField, 'arrayField wasn\'t in the data' );
                data = schema.serializeItems( {
                    dateArrayField: [
                        new Date(), new Date()
                    ]
                } );
                
                Assert.areEqual( 2, data.dateArrayField.length, 'two date items converted' );
                Assert.isString( data.dateArrayField[ 0 ], 'date item converted to string' );
                Assert.isString( data.dateArrayField[ 1 ], 'date item converted to string' );
                
            },
            
            testValidateSingleField: function() {
                var schemaConfig = {
                    intField: { type: 'integer', validate: {
                        min: 0,
                        max: 10,
                        required: true,
                        minlength: 1,
                        maxlength: 100
                    } }
                };
                var schema = AFrame.construct( {
                    type: AFrame.Schema,
                    config: {
                        schema: schemaConfig
                    }
                } );
                
                var validityState = schema.validate( {
                    intField: 1
                } );
                Assert.isTrue( validityState, 'object is valid' );
                
                validityState = schema.validate( {} );
                
                Assert.isObject( validityState, 'validation of empty required field' );
                Assert.isFalse( validityState.intField.valid, 'invalid item' );
                Assert.isTrue( validityState.intField.valueMissing, 'value is missing' );

                var validityState = schema.validate( {
                    intField: -1
                } );
                
                Assert.isObject( validityState.intField, 'invalid item' );
                Assert.isFalse( validityState.intField.valid, 'invalid item' );
                Assert.isTrue( validityState.intField.rangeUnderflow, 'value is under min' );
                
            },
            
            testValidateMultipleFieldsOneDefined: function() {
                var schemaConfig = {
                    intField: { type: 'integer', validate: {
                        min: 0,
                        max: 10,
                        required: true
                    } },
                    
                    stringField: { type: 'text', validate: {
                        minlength: 1,
                        maxlength: 100,
                        required: true
                    } }
                };
                var schema = AFrame.Schema( schemaConfig );
                
                var validityState = schema.validate( {
                    intField: 1
                }, true );
                Assert.isTrue( validityState, 'object is valid, we are ignoring missing fields' );
                
                // We still have a missing value, intField is undefined.
                var validityState = schema.validate( {
                    intField: undefined
                }, true );

                Assert.isObject( validityState.intField, 'intField has undefined value' );
                Assert.isFalse( validityState.intField.valid, 'intField is missing, valid is false' );
                Assert.isTrue( validityState.intField.valueMissing, 'valueMissing set' );
                
                var validityState = schema.validate( {
                    intField: 1
                }, false );
                
                Assert.isObject( validityState.stringField, 'stringField is missing' );
                Assert.isFalse( validityState.stringField.valid, 'stringField is missing, valid is false' );
                Assert.isTrue( validityState.stringField.valueMissing, 'valueMissing set' );
            },
            
            testValidateMultipleFieldsMultipleDefined: function() {
                var schemaConfig = {
                    intField: { type: 'integer', validate: {
                        min: 0,
                        max: 10,
                        required: true
                    } },
                    
                    stringField: { type: 'text', validate: {
                        minlength: 1,
                        maxlength: 10,
                        required: true
                    } }
                };
                var schema = AFrame.Schema( schemaConfig );
                
                var validityState = schema.validate( {
                    intField: 1,
                    stringField: '0123456789'
                }, true );
                Assert.isTrue( validityState, 'object is valid, we are ignoring missing fields' );
                
                var validityState = schema.validate( {
                    intField: -1,
                    stringField: '01234567890'
                }, false );
                
                Assert.isObject( validityState.intField, 'intField is is too low' );
                Assert.isFalse( validityState.intField.valid, 'intField invalid, valid set to false' );
                Assert.isTrue( validityState.intField.rangeUnderflow, 'rangeUnderflow on intField set' );
                
                Assert.isObject( validityState.stringField, 'stringField is too long' );
                Assert.isFalse( validityState.stringField.valid, 'stringField is too long, valid set to false' );
                Assert.isTrue( validityState.stringField.tooLong, 'tooLong set' );
                
            },
            
            testValidateNoExplicitValidators: function() {
                var schemaConfig = {
                    intField: { type: 'integer' }
                };
                
                var schema = AFrame.Schema( schemaConfig );
                
                var validityState = schema.validate( {
                    intField: 'a'
                } );

                Assert.isFalse( validityState.intField.valid, 'trying to set an integer to a string' );
                Assert.isTrue( validityState.intField.typeMismatch, 'trying to set an integer to a string' );
            },
                
            testSchemaNoConfigError: function() {
                var errorThrown;
                try {
                    var schema = AFrame.construct( {
                        type: AFrame.Schema
                    } );
                }
                catch( e ) {
                    errorThrown = e;
                }
                
                Assert.areEqual( 'Schema.js: Schema requires a schema configuration object', errorThrown, 'correct error thrown' );
            },
            
            testCreateSchemaUsingSameConfig: function() {
                var schemaConfig = {
                    intField: { type: 'integer' }
                };
                
                var schema = AFrame.Schema( schemaConfig );
                var schema2 = AFrame.Schema( schemaConfig );
                
                Assert.areSame( schema2, schema, 'a second creation of a schema config returns the same schema' );
                
            }
    } );
}());
