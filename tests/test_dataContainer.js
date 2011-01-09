testsToRun.push( function testDataContainer( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
		
	var test = new TestCase( {
	 
		name: "TestCase AFrame.DataContainer",

		setUp: function() {
		    this.dataContainer = AFrame.construct( {
			type: AFrame.DataContainer
		    } );
		},
		
		tearDown : function () {
		    this.dataContainer.teardown();
		    this.dataContainer = null;
		    delete this.dataContainer;
		},
		
		testSet: function() {
			/* When we set an item, it should trigger a message that the field was set */
			var eventData;
			this.dataContainer.bindEvent( 'onSet', function( event ) {
				eventData = event;
			} );
			
			var oldValue = this.dataContainer.set( 'fieldName', 'fieldValue' );
			
			Assert.isUndefined( oldValue, 'initial set with no initial data should return oldValue of undefined' );

			Assert.isObject( eventData, 'onSet correctly triggered with data' );
			Assert.isTrue( eventData.hasOwnProperty( 'oldValue' ), 'oldValue is in data set' );
			Assert.isString( eventData.value, 'value is in data set' );
			Assert.isObject( eventData.container, 'container is in data set' );
			Assert.isString( eventData.fieldName, 'fieldName is in data set' );
			
			
			/* second set should give oldValue of fieldValue */
			
			oldValue = this.dataContainer.set( 'fieldName', 'value2' );
			
			Assert.areEqual( 'fieldValue', oldValue, 'second set gives return of correct oldValue' );
			Assert.areEqual( 'fieldValue', eventData.oldValue, 'eventData of second set gives correct oldValue' );
		},
		
		testGet: function() {
			this.dataContainer.set( 'fieldName', 'fieldValue' );
			
			var fieldValue = this.dataContainer.get( 'fieldName' );
			Assert.areEqual( 'fieldValue', fieldValue, 'get correctly gets the data' );
		},
		
		testBindFieldUnbindField: function() {
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
			
			this.dataContainer.unbindField( id );
			
			this.dataContainer.set( 'fieldName', 'value3' );
			Assert.areEqual( 'value2', bindFieldData.value, 'bound callback not called after field is unbound' );
		},
		
		testForEach: function() {
			var forEachCount = 0;
			
			this.dataContainer.set( 'field1', 1 );
			this.dataContainer.set( 'field2', 1 );
			this.dataContainer.set( 'field3', 1 );
			
			this.dataContainer.forEach( function( data, fieldName ) {
				forEachCount++;
			} );
			
			Assert.areEqual( 3, forEachCount, 'forEach called once for each field' );
		},
		
		testConstructor: function() {
			var data = {
				field1: 'value1',
				field2: 'value2'
			};
			
			var dataContainer = AFrame.DataContainer( data );
			Assert.isTrue( ( dataContainer instanceof AFrame.DataContainer ), 'successful creation of DataContainer from data' );
			
			var secondDataContainer = AFrame.DataContainer( dataContainer );
			Assert.isTrue( ( secondDataContainer instanceof AFrame.DataContainer ), 'successful creation of DataContainer from another DataContainer' );
			
			var thirdDataContainer = AFrame.DataContainer( data );
			Assert.isTrue( ( thirdDataContainer === dataContainer ), 'making a second DataContainer from data gives back the same DataContainer' );
		}
	} );
	
	
	
	TestRunner.add( test );

} );