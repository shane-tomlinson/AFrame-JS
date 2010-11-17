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
			
			var schemaConfig = {
				stringField: { type: 'string', def: 'stringField Default Value' },
				stringFieldFixup: { type: 'string', def: 'stringFieldFixup Default Value',
					fixup: fixupStringField, cleanup: cleanStringField },
				stringFieldFixupFunc: { type: 'string', def: defaultString }
			};
			
			this.schema = AFrame.construct( {
				type: 'AFrame.Schema',
				config: {
					schema: schemaConfig
				}
			} );
		},
		
		tearDown : function () {
			this.schema.teardown();
		},

		testSchemaGetDefault: function() {
			var defaultObject = this.schema.getDefaults();

			Assert.areEqual( 'stringField Default Value', defaultObject.stringField, 'Default value set for stringField' );
			Assert.areEqual( 'stringFieldFixup Default Value', defaultObject.stringFieldFixup, 'Default value set for stringFieldFixup' );
			Assert.areEqual( 'returned by function', defaultObject.stringFieldFixupFunc, 'can get default value using function' );
		},

		testFixData: function() {
			var fixedData = this.schema.fixData( {} );
			
			// with no data, should return same as default items unless a fixup function modifies a value
			Assert.areEqual( 'stringField Default Value', fixedData.stringField, 'Default value set for stringField' );
			Assert.areEqual( 'stringFieldFixup Default Value', fixedData.stringFieldFixup, 'Default value set for stringFieldFixup' );
			Assert.areEqual( 'returned by function', fixedData.stringFieldFixupFunc, 'Default func called for stringFieldFixupFunc' );

			
			fixedData = this.schema.fixData( {
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
			fixedData = this.schema.fixData( {
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
			Assert.areEqual( 3, this.forEachCallbackCallCount, 'callback called twice' );
		},

		testGetPersistenceObject: function() {
			var persistence = this.schema.getPersistenceObject( {
				stringField: 'stringField value',
				stringFieldFixup: 'stringFieldFixup value',
				extraField: 'extra field'
			} );

			Assert.areEqual( 'stringField value', persistence.stringField, 'stringField added' );
			Assert.areEqual( 'stringFieldFixup value', persistence.stringFieldFixup, 'stringFieldFixup added' );
			Assert.isUndefined( persistence.extraField, 'extraField not added' );

			this.useCleanedValue = true;
			var persistence = this.schema.getPersistenceObject( {
				stringField: 'stringField value',
				stringFieldFixup: 'stringFieldFixup value'
			} );
			
			Assert.areEqual( 'stringField value', persistence.stringField, 'stringField added' );
			Assert.areEqual( 'modified string field', persistence.stringFieldFixup, 'fixup function value used' );
			
		}
	} );

	TestRunner.add( testAObject );
	
} );