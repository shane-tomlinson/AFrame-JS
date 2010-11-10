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
		
		testCIDSetInConfig: function() {
			this.aobject.init( {
				cid: 'testcid'
			} );
			
			Assert.areEqual( 'testcid', this.aobject.getCID(), 'CID assigned correctly' );
		},
		
		testCIDAssigned: function() {
			this.aobject.init( {} );
			
			Assert.isNotUndefined( this.aobject.getCID(), 'CID assigned automatically' );
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
		
		testAddChild: function() {
			var tornDown = false;
			var objectToTeardown = {
				teardown: function() {
					tornDown = true;
				},
				getCID: function() {
					return 1;
				}
			};
			
			this.aobject.init( {} );
			this.aobject.addChild( objectToTeardown );
			this.aobject.teardown();
			Assert.isTrue( tornDown, 'child\'s teardown called' );
		},
		
		testRemoveChild: function() {
			var tornDown = false;
			var objectToRemove = {
				teardown: function() {
					tornDown = true;
				},
				getCID: function() {
					return 1;
				}
			};
			
			this.aobject.init( {} );
			this.aobject.addChild( objectToRemove );
			this.aobject.removeChild( 1 );
			this.aobject.teardown();
			Assert.isFalse( tornDown, 'child\'s teardown not called since it was already removed' );
		}
	} );
	
	
	
	TestRunner.add( testAObject );
	
	
} );