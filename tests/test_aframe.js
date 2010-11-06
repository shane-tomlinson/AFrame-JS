function SuperClass() {
}
SuperClass.prototype = {
	hasFunc: function() {
		return true;
	},
	
	sharedFunc: function() {
	    this.sharedFuncCalled = true;
	    return true;
	}
};

function SubClass() {
}
AFrame.extend( SubClass, SuperClass, { 
    superExtendedFunc: function() {
	return true;
    },
    
    sharedFunc: function() {
	return SubClass.superclass.sharedFunc.call( this );
    },
    
    init: function() {
      this.initCalled = true;
    },
    
    itemToRemove: true
}, {
	funcsFromSecondMixin: function() {
	}
}  );

var A = {
    SubClass: function() {
	this.init = function() {};
	return true;
    }
};

testsToRun.push( function testAFrame( Y ) {
 
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	
	var testExtend = new Y.Test.Case( {
	 
		name: "TestCase AFrame.extend",
	 
		setUp : function () {		
			this.subInstance = new SubClass();
		},
	 
		tearDown : function () {
			this.subInstance = null;
			delete this.subInstance;
		},
	 
		testExtendSuperclass: function () {
		    Assert.isFunction( this.subInstance.hasFunc, 'superExtendedFunc exists' );
		    Assert.isTrue( this.subInstance.hasFunc(), 'subclass function returns true' );
		    Assert.isObject( SubClass.superclass, 'superclass exists' );
		    Assert.areEqual( SubClass.superclass.hasFunc, SuperClass.prototype.hasFunc, 'superclass points to super\'s function' );
			
			Assert.isFunction( this.subInstance.funcsFromSecondMixin, 'extend works with more than one mixin' );
		},
		
		testExtendExtraFuncs: function () {
		    Assert.isFunction( this.subInstance.superExtendedFunc, 'superExtendedFunc exists' );
		    Assert.isTrue( this.subInstance.superExtendedFunc(), 'superExtendedFunc returns correctly' );
		},
		
		testExtendSuperclassInheritedFuncCall: function () {
 		    Assert.isTrue( this.subInstance.sharedFunc(), 'sharedFunc calls super class' );
 		    Assert.isTrue( this.subInstance.sharedFuncCalled, 'sharedFunc calls super class sets value' );
		}

	} );
	
	var testMixin = new Y.Test.Case( {
		name: "TestCase AFrame.mixin",
	 
		setUp : function () {		
			this.subInstance = new SubClass();
			AFrame.mixin( this.subInstance, {
			    mixedFunction: function() {
				return true;
			    }
			} );
		},
	 
		tearDown : function () {
			this.subInstance = null;
			delete this.subInstance;
		},
		
		testMixin: function() {
		    Assert.isFunction( this.subInstance.mixedFunction, 'mixedFunction added' );
		    Assert.isTrue( this.subInstance.mixedFunction(), 'mixedFunction can be called' );
		}
	  
	} );

	var testRemove = new Y.Test.Case( {
		name: "TestCase AFrame.remove",
	 
		setUp : function () {		
		    this.subInstance = new SubClass();
		},
	 
		tearDown : function () {
		    this.subInstance = null;
		    delete this.subInstance;
		},
		
		testRemove: function() {
		    Assert.isTrue( this.subInstance.itemToRemove, 'itemToRemove exists' );
		    AFrame.remove( this.subInstance, 'itemToRemove' );
		    Assert.isFalse( this.subInstance.hasOwnProperty( 'itemToRemove' ), 'item is removed' );
		}
	} );

	var testConstruct= new Y.Test.Case( {
		name: "TestCase AFrame.construct",
	 
		testConstructOneLevel: function() {
		    this.subInstance = AFrame.construct( {
			type: 'SubClass'
		    } );
		    
		    Assert.isTrue( this.subInstance.initCalled, 'init called' );

		    this.subInstance = null;
		    delete this.subInstance;
		},
		
		testTypeWithDot: function() {
		    var instance = AFrame.construct( {
			type: 'A.SubClass'
		    } );
		    
		    Assert.isObject( instance, 'object with dot created' );
		}

	} );

	var testGetUniqueID = new Y.Test.Case( {
		name: 'TestCase AFrame.getUniqueID',

		testGetUniqueID: function() {
			var id1 = AFrame.getUniqueID();
			var id2 = AFrame.getUniqueID();

			Assert.areNotEqual( id1, id2, 'ids are unique' );
		}
		
	} );
	
	TestRunner.add( testExtend );
	TestRunner.add( testMixin );
	TestRunner.add( testRemove );
	TestRunner.add( testConstruct );
	TestRunner.add( testGetUniqueID );
	
} );