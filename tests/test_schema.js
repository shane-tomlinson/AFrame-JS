testsToRun.push( function testAObject( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	
	var testAObject = new TestCase( {
		
		name: "TestCase AFrame.Schema",
		
		setUp: function() {
			var fixupStringFieldCleanup = function( data ) {
				var fieldValue = this.useFixedValue ? 'modified string field' : data.value;
				return fieldValue;
			}.bind( this );
			
			var schemaConfig = {
				stringField: { type: 'string', def: 'stringField Default Value' },
				stringFieldFixup: { type: 'string', def: 'stringFieldFixup Default Value', fixup: fixupStringFieldCleanup }
				
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
		},

		testFixData: function() {
			var fixedData = this.schema.fixData( {} );
			
			// with no data, should return same as default items unless a fixup function modifies a value
			Assert.areEqual( 'stringField Default Value', fixedData.stringField, 'Default value set for stringField' );
			Assert.areEqual( 'stringFieldFixup Default Value', fixedData.stringFieldFixup, 'Default value set for stringFieldFixup' );

			fixedData = this.schema.fixData( {
				stringField: 'this is a string',
				stringFieldFixup: 'run through fixup',
				extraField: 'extra'
			} );

			// all values should be the same as defined, extraField should not be in result set
			Assert.areEqual( 'this is a string', fixedData.stringField, 'specified value used for stringField' );
			Assert.areEqual( 'run through fixup', fixedData.stringFieldFixup, 'specified value used for stringFieldFixup' );
			Assert.isFalse( fixedData.hasOwnProperty( 'extraField' ), 'extraField is not on object' );

			// make the fixup function modify value
			this.useFixedValue = true;
			fixedData = this.schema.fixData( {
				stringFieldFixup: 'should be modified'
			} );
			
			// fixup function modifies data
			Assert.areEqual( 'modified string field', fixedData.stringFieldFixup, 'stringFieldFixup modified correctly' );
		}
	} );

	TestRunner.add( testAObject );
	
} );