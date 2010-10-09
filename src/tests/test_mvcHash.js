function testMVCHash( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
		
	var testAObject = new TestCase( {
	 
		name: "TestCase AFrame.MVCHash",

		setUp: function() {
		    this.hash = AFrame.construct( {
			type: 'AFrame.MVCHash'
		    } );
		},
		
		tearDown : function () {
		    this.hash.teardown();
		    this.hash = null;
		    delete this.hash;
		},
		
		testSet: function() {
		    var beforeSetData;
		    var onBeforeSet = function( data ) {
			beforeSetData = data;
			
			// adding a field to the data, making sure we get it in onSet
			data.item.field2 = "field2";
		    };
		    
		    var setData;
		    var onSet = function( data ) {
			setData = data;
		    };
		    
		    this.hash.bindEvent( 'onBeforeSet', onBeforeSet );
		    this.hash.bindEvent( 'onSet', onSet );
		    
		    var id = 1;
		    this.hash.set( id, { 
		      field: 'fieldValue'
		    } );
		    
		    Assert.isObject( beforeSetData, 'onBeforeSet sets data' );
		    Assert.areEqual( id, beforeSetData.id, 'onBeforeSet gives same id as insert' );
		    Assert.areEqual( 'fieldValue', beforeSetData.item.field, 'onBeforeSet gives data we pass in' );
		    
		    Assert.isObject( setData, 'onSet sets data' );
		    Assert.areEqual( id, setData.id, 'onSet gives same id as insert' );
		    Assert.areEqual( 'fieldValue', setData.item.field, 'onSet gives data we pass in' );
		    Assert.areEqual( 'field2', setData.item.field2, 'onSet gets data set by onBeforeInsert' );
		},
		
		testGet: function() {
		    var item = {
			fieldName: 'fieldValue'
		    };
		    
		    var id = 1;
		    this.hash.set( id, item );
		    var retrievedItem = this.hash.get( id );
		    
		    Assert.areEqual( item, retrievedItem, 'item and the retrievedItem are the same' );
		},
		
		testRemove: function() {
		    var item = {
			fieldName: 'fieldValue'
		    };
		    
		    var id = 1;
		    
		    this.hash.set( id, item );
		    var deletedItem = this.hash.remove( id );
		    Assert.areEqual( item, deletedItem, 'got the correct deleted item' );
		    
		    var retrievedItem = this.hash.get( id );
		    Assert.isUndefined( retrievedItem, 'remove correctly occured' );
		    
		    // assert no blowup
		    var noItemToRemove = this.hash.remove( 2 );
		    Assert.isUndefined( noItemToRemove, 'no item to remove doesn\'t blow up' );
		},
		
		testRemoveEvents: function() {
		    var item = {
			fieldName: 'fieldValue'
		    };
		    
		    var id = 1;
		    
		    this.hash.set( id, item );
		  
		    var beforeRemoveData;
		    var onBeforeRemove = function( data ) {
		      beforeRemoveData = data;
		    };
		    
		    var removeData;
		    var onRemove = function( data ) {
		      removeData = data;
		    };
		    
		    this.hash.bindEvent( 'onBeforeRemove', onBeforeRemove );
		    this.hash.bindEvent( 'onRemove', onRemove );
		    
		    this.hash.remove( id );
		    
		    Assert.areEqual( id, beforeRemoveData.id, 'onBeforeRemove ids are the same' );
		    Assert.areEqual( item, beforeRemoveData.item, 'onBeforeRemove items are the same' );
		    
		    Assert.areEqual( id, removeData.id, 'onRemove ids are the same' );
		    Assert.areEqual( item, removeData.item, 'onRemove items are the same' );
		}
	} );
	
	
	
	TestRunner.add( testAObject );

}