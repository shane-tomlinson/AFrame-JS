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
	return SubClass.sc.sharedFunc.call( this );
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

testsToRun.push( {
 
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
		    Assert.isObject( SubClass.sc, 'sc exists' );
		    Assert.areEqual( SubClass.sc.hasFunc, SuperClass.prototype.hasFunc, 'sc points to super\'s function' );
			
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

testsToRun.push( {
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

testsToRun.push( {
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


testsToRun.push( {
		name: "TestCase AFrame.construct",
	 
		testConstructOneLevel: function() {
		    var instance = AFrame.construct( {
				type: SubClass
		    } );
		    
		    Assert.isTrue( instance.initCalled, 'init called' );
		},
		
		testTypeWithDot: function() {
		    var instance = AFrame.construct( {
				type: A.SubClass
		    } );
		    
		    Assert.isObject( instance, 'object with dot created' );
		}

} );

testsToRun.push( {
    name: 'TestCase AFrame.create',
    testCreateNoConfig: function() {
        var instance = AFrame.create( SubClass );
        
        Assert.isTrue( instance instanceof SubClass, 'instance is an instance of subclass' );
        Assert.isTrue( instance.initCalled, 'init is called' );
    },
    
    testCreateConfig: function() {
        var config = {};
        var instance = AFrame.create( AFrame.AObject, config );
        
        Assert.areSame( config, instance.getConfig(), 'config passed to init' );
    },
    
    testCreateWithPluginInArray: function() {
        var initPluginConfig;
        var setPluggedPlugged;
        
        var PluginMock = function() {};
        PluginMock.prototype = {
            init: function( config ) {
                initPluginConfig = config;
            },
            setPlugged: function( plugged ) {
                setPluggedPlugged = plugged;
            }
        }
        
        var pluginConfig = {};
        var config = {
            plugins: [ [ PluginMock, pluginConfig ] ]
        };
        
        var instance = AFrame.create( AFrame.AObject, config );
        
        Assert.areSame( pluginConfig, initPluginConfig, 'plugin created' );
        Assert.areSame( instance, setPluggedPlugged, 'setPlugged called with new object' );
    },
    
    testCreateWithPlugin: function() {
        var pluginInitCalled;
        var setPluggedPlugged;
        
        var PluginMock = function() {};
        PluginMock.prototype = {
            init: function( config ) {
                pluginInitCalled = true;
            },
            setPlugged: function( plugged ) {
                setPluggedPlugged = plugged;
            }
        }
        
        var config = {
            plugins: [ PluginMock ]
        };
        
        var instance = AFrame.create( AFrame.AObject, config );
        
        Assert.isTrue( pluginInitCalled, 'plugin\'s init is called' );
    }
} );

testsToRun.push( {
		name: 'TestCase AFrame.getUniqueID',

		testGetUniqueID: function() {
			var id1 = AFrame.getUniqueID();
			var id2 = AFrame.getUniqueID();

			Assert.areNotEqual( id1, id2, 'ids are unique' );
		}
} );
	
testsToRun.push( {
    name: 'TestCase Type Check Functions',
    
    testDefined: function() {
        Assert.isFalse( AFrame.defined(), 'undefined value' );
        Assert.isTrue( AFrame.defined( '1' ), 'defined value' );
    },
    
    testFunc: function() {
        Assert.isFalse( AFrame.func('1'), 'not a function' );
        
        var testFunc = function() {
        };
        
        Assert.isTrue( AFrame.func( testFunc ), 'a function' );
    },
    
    testString: function() {
        Assert.isFalse( AFrame.string( 1 ), '1 is not a string' );
        Assert.isTrue( AFrame.string( 'testString' ), 'a string' );
        Assert.isTrue( AFrame.string( new String( 'testString' ) ), 'a string' );
    },
    
    testArray: function() {
        Assert.isFalse( AFrame.array( 1 ), '1 is not an array' );
        Assert.isTrue( AFrame.array( [] ), '[] is not an array' );
        Assert.isTrue( AFrame.array( new Array() ), 'new Array creates an array' );
    }
} );

testsToRun.push( {
    name: 'TestCase AFrame.Class',
    
    testNewClassNoBase: function() {
        var proto = {
            init: function() {
            }
        };
        var Class = AFrame.Class( proto );
        
        Assert.isFunction( Class );
        Assert.areSame( Class, Class.prototype.constructor, 'prototype constructor is set' );
        Assert.areSame( proto.init, Class.prototype.init, 'init uses the init we defined' );
    },
    
    testNewClassBase: function() {
        var proto = {
            init: function() {}
        };
        
        var constCalled = false;
        function MockBase() {
            constCalled = true;
        }
        MockBase.prototype = {
            constructor: MockBase,
            init: function() {
            }
        };
        
        var Class = AFrame.Class( MockBase, proto );
        Assert.isFunction( Class );
        Assert.isTrue( Class === Class.prototype.constructor, 'prototype constructor is set' );
        Assert.areSame( proto.init, Class.prototype.init, 'init uses the init we defined' );
        
        var instance = AFrame.construct( {
            type: Class
        } );
        
        Assert.isTrue( instance instanceof MockBase, 'new class is instance of AObject' );
        Assert.isTrue( constCalled, 'base constructor is called' );
    },
    
    testNewClassMultipleMixins: function() {
        var mixin1 = {
            init: function() {}
        };
        
        var mixin2 = {
            func2: function() {}
        };
        
        var Class = AFrame.Class( mixin1, mixin2 );
        
        Assert.isFunction( Class.prototype.init, 'init added to Class' );
        Assert.isFunction( Class.prototype.func2, 'func2 added to Class' );
        
    }
} );