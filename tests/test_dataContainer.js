function testDataContainer( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
		
	var test = new TestCase( {
	 
		name: "TestCase AFrame.DataContainer",

		setUp: function() {
		    this.dataContainer = AFrame.construct( {
			type: 'AFrame.DataContainer'
		    } );
		},
		
		tearDown : function () {
		    this.dataContainer.teardown();
		    this.dataContainer = null;
		    delete this.dataContainer;
		},
		
		testSet: function() {
			/* When we set an item, it should trigger a message that the field was set */
			var onSetData;
			this.dataContainer.bindEvent( 'onSet', function( data ) {
				onSetData = data;
			} );
			
			var oldValue = this.dataContainer.set( 'fieldName', 'fieldValue' );
			
			Assert.isUndefined( oldValue, 'initial set with no initial data should return oldValue of undefined' );

			Assert.isObject( onSetData, 'onSet correctly triggered with data' );
			Assert.isTrue( onSetData.hasOwnProperty( 'oldValue' ), 'oldValue is in data set' );
			Assert.isString( onSetData.value, 'value is in data set' );
			Assert.isObject( onSetData.container, 'container is in data set' );
			Assert.isString( onSetData.fieldName, 'fieldName is in data set' );
			
			
			/* second set should give oldValue of fieldValue */
			
			oldValue = this.dataContainer.set( 'fieldName', 'value2' );
			
			Assert.areEqual( 'fieldValue', oldValue, 'second set gives return of correct oldValue' );
			Assert.areEqual( 'fieldValue', onSetData.oldValue, 'onSetData of second set gives correct oldValue' );
		},
		
		testGet: function() {
			this.dataContainer.set( 'fieldName', 'fieldValue' );
			
			var fieldValue = this.dataContainer.get( 'fieldName' );
			Assert.areEqual( 'fieldValue', fieldValue, 'get correctly gets the data' );
		},
		
		testBindField: function() {
			var bindFieldData;
			
			var id = this.dataContainer.bindField( 'fieldName', function( data ) {
				bindFieldData = data;
			}, this );
			
			Assert.isObject( bindFieldData, 'callback correctly called with data' );
			Assert.isTrue( bindFieldData.hasOwnProperty( 'oldValue' ), 'oldValue is in data set' );
			Assert.isTrue( bindFieldData.hasOwnProperty( 'value' ), 'value is in data set' );
			Assert.isObject( bindFieldData.container, 'container is in data set' );
			Assert.isString( bindFieldData.fieldName, 'fieldName is in data set' );
			
			this.dataContainer.set( 'fieldName', 'value2' );
			Assert.areEqual( 'value2', bindFieldData.value, 'bound callback called with data after set' );
			
			this.dataContainer.unbindField( 'fieldName', id );
			
			this.dataContainer.set( 'fieldName', 'value3' );
			Assert.areEqual( 'value2', bindFieldData.value, 'bound callback not called after field is unbound' );
		}
	} );
	
	
	
	TestRunner.add( test );

}		