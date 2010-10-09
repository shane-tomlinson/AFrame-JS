function testAObject( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	
	var testAObject = new TestCase( {
	 
		name: "TestCase AFrame.AObject",

		setUp: function() {
		    this.aobject = new AFrame.AObject();
		},
		
		tearDown : function () {
		    this.aobject.teardown();
		    this.aobject = null;
		    delete this.aobject;
		},
		
		testInit: function() {
		    this.aobject.init( {
		        configVal: true
		    } );
		    
		    var objectConfig = this.aobject.getConfig();
		    Assert.isTrue( objectConfig.configVal, 'configuration correctly set' );
		},
		
		testIsTriggeredNoListener: function() {
		    Assert.isFalse( this.aobject.isEventTriggered( 'onInit' ), 'onInit event not triggered' );
		    var callback = function() {};

		    this.aobject.init( {
		        configVal: true
		    } );
		    
		    Assert.isFalse( this.aobject.isEventTriggered( 'onInit' ), 'onInit event not triggered, no listener' );
		  
		},
		
		testIsTriggeredListener: function() {
		    Assert.isFalse( this.aobject.isEventTriggered( 'onInit' ), 'onInit event not triggered' );
		    var callback = function() {};

		    this.aobject.bindEvent( 'onInit', callback );
		    this.aobject.init( {
		        configVal: true
		    } );
		    
		    Assert.isTrue( this.aobject.isEventTriggered( 'onInit' ), 'onInit event triggered' );
		},
		
		testBindTriggerEvent: function() {
		    var callbackCalled = false;
		    var callback = function() {
		      callbackCalled = true;
		    };
		    
		    var callbackWithContext = function() {
			this.callbackCalled = true;
 			this.args = Array.prototype.slice.call( arguments, 0 );
		    };
		    
		    this.aobject.bindEvent( 'onCallback', callback );
		    this.aobject.bindEvent( 'onCallback', callbackWithContext, this );
		    
		    this.aobject.triggerEvent( 'onCallback', 1, 2 );
		    
		    Assert.isTrue( callbackCalled, 'callback bound & called' );
		    Assert.isTrue( this.callbackCalled, 'callback bound & called with context' );
		    
		    Assert.isArray( this.args, 'arguments passed correctly with trigger' );
		    Assert.areEqual( 1, this.args[ 0 ], 'arguments passed correctly with trigger' );
		  
		},
		
		testUnbindEvent: function() {
		    callbackCalled = false;
		    var callback = function() {
			callbackCalled = true;
		    };
		    
		    var callbackID = this.aobject.bindEvent( 'onCallback', callback );
		    this.aobject.unbindEvent( 'onCallback', callbackID );
		    
		    this.aobject.triggerEvent( 'onCallback' );
		    Assert.isFalse( callbackCalled, 'callback unbound with ID' );
		}
	 
	} );
	
	
	
	TestRunner.add( testAObject );
	
	
}