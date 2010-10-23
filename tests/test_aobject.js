testsToRun.push( function testAObject( Y ) {
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
		}
	} );
	
	
	
	TestRunner.add( testAObject );
	
	
} );