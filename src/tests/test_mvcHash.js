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
		
		testInsert: function() {
		    var beforeInsertItem;
		    var beforeInsertID;
		    var onBeforeInsert = function( config ) {
			beforeInsertItem = config.item;
			beforeInsertID = config.id;
			
			// adding a field to the data, making sure we get it in onInsert
			config.item.field2 = "field2";
		    };
		    
		    var insertData;
		    var insertID;
		    var onInsert = function( config ) {
			insertData = config.item;
			insertID = config.id;
		    };
		    
		    this.hash.bindEvent( 'onBeforeInsert', onBeforeInsert );
		    this.hash.bindEvent( 'onInsert', onInsert );
		    
		    var id = 1;
		    this.hash.insert( id, { 
		      field: 'fieldValue'
		    } );
		    
		    Assert.isObject( beforeInsertItem, 'onBeforeInsert sets data' );
		    Assert.areEqual( id, beforeInsertID, 'onBeforeInsert gives same id as insert' );
		    Assert.areEqual( 'fieldValue', beforeInsertItem.field, 'onBeforeInsert gives data we pass in' );
		    
		    Assert.isObject( insertData, 'onInsert sets data' );
		    Assert.areEqual( id, insertID, 'onInsert gives same id as insert' );
		    Assert.areEqual( 'fieldValue', insertData.field, 'onInsert gives data we pass in' );
		    Assert.areEqual( 'field2', insertData.field2, 'onInsert gets data set by onBeforeInsert' );
		},
		
		testGet: function() {
		    var item = {
			fieldName: 'fieldValue'
		    };
		    
		    var id = 1;
		    this.hash.insert( id, item );
		    var retrievedItem = this.hash.get( id );
		    
		    Assert.areEqual( item, retrievedItem, 'item and the retrievedItem are the same' );
		},
		
		testRemove: function() {
		    var item = {
			fieldName: 'fieldValue'
		    };
		    
		    var id = 1;
		    
		    this.hash.insert( id, item );
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
		    
		    this.hash.insert( id, item );
		  
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