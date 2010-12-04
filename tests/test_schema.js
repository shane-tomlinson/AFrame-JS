testsToRun.push( function testAObject( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	
	var testAObject = new TestCase( {
		
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
				noSaveField: { type: 'string', save: false, def: 'this field will not be saved in getFormData' }
			};
			
			this.schema = AFrame.construct( {
				type: AFrame.Schema,
				config: {
					schema: this.schemaConfig
				}
			} );
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
			var fields = 0;
			for( var key in this.schemaConfig ) {
				fields++;
			}
			Assert.areEqual( fields, this.forEachCallbackCallCount, 'callback called for each' );
		},

		testGetFormData: function() {
			var persistence = this.schema.getFormData( {
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
			var persistence = this.schema.getFormData( {
				stringField: 'stringField value',
				stringFieldFixup: 'stringFieldFixup value'
			} );
			
			Assert.areEqual( 'stringField value', persistence.stringField, 'stringField added' );
			Assert.areEqual( 'modified string field', persistence.stringFieldFixup, 'fixup function value used' );
			
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
			AFrame.Schema.addAppDataCleaner( 'fixer', function( data ) {
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
			AFrame.Schema.addFormDataCleaner( 'persistencer', function( data ) {
				persistencerValue = data;
				return 'persistence';
			} );
			
			var persistence = this.schema.getFormData( { 
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
			var persistence = this.schema.getFormData( { 
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
				schemaField: { type: 'inner' },
			};
			AFrame.Schema.addSchemaConfig( 'outer', outerSchemaConfig );
			
			var schema = AFrame.Schema.getSchema( 'outer' );
		
			var data = schema.getAppData( {} );
			
			Assert.isObject( data.schemaField, 'schemaField created' );
			Assert.areEqual( 'inner value', data.schemaField.innerField, 'schemaField.innerField has correct value' );
			
			var persist = schema.getFormData( {
				schemaField: {
					innerField: 'inner there',
					extraField: 'extra field'
				}
			} );
			
			Assert.areEqual( 'inner there', persist.schemaField.innerField, 'schemaField.innerField is there' );
			Assert.isUndefined( persist.schemaField.extraField, 'schemaField.extraField is not there' );
			
			persist = schema.getFormData( {
				schemaField: {}
			} );
			
			Assert.isObject( persist.schemaField, 'schemaField made it' );
			
			persist = schema.getFormData( {} );
			
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
			
			
			data = schema.getFormData( {
			} );
			
			Assert.isUndefined( data.arrayField, 'arrayField wasn\'t in the data' );
			data = schema.getFormData( {
				dateArrayField: [
					new Date(), new Date()
				]
			} );
			
			Assert.areEqual( 2, data.dateArrayField.length, 'two date items converted' );
			Assert.isString( data.dateArrayField[ 0 ], 'date item converted to string' );
			Assert.isString( data.dateArrayField[ 1 ], 'date item converted to string' );
			
		}
		
		
	} );

	TestRunner.add( testAObject );
	
} );