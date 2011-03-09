testsToRun.push( {
	 
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
		
        testTriggerEvent: function() {
            var triggeredEvent, extraParam = true;
		    var callback = function( event, extra ) {
                triggeredEvent = event;
                extraParam = extra;
            };

            this.aobject.bindEvent( 'onInit', callback );
		    this.aobject.triggerEvent( 'onInit' );
            
            Assert.areEqual( 'onInit', triggeredEvent.type, 'triggeredEvent type is set' );
            Assert.areEqual( this.aobject, triggeredEvent.target, 'triggeredEvent target is set' );
            Assert.isUndefined( extraParam, 'extraParam is undefined' );
            
		    this.aobject.triggerEvent( 'onInit', 'blue' );
            Assert.areEqual( 'blue', extraParam, 'extraParam is set to blue' );
        },
        
        testTriggerProxy: function() {
            var proxy = this.aobject.triggerProxy( 'proxiedEvent' );
            
            var eventTriggered = false;
            this.aobject.bindEvent( 'proxiedEvent', function() { 
                eventTriggered = true;
            } );
            
            // call the proxied function
            proxy();
            
            Assert.isTrue( eventTriggered, 'triggerProxy works' );
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
		},
        
        testImport: function() {
            this.aobject.import( { field1: 'field1value', field2: 'field2value' }, 'field1', 'field2' );
            
            Assert.areEqual( 'field1value', this.aobject.field1, 'field1 imported' );
            Assert.areEqual( 'field2value', this.aobject.field2, 'field2 imported' );

            this.aobject.import( { field3: 'field3value' } );
            Assert.areEqual( 'field3value', this.aobject.field3, 'field3 imported' );
        },
        
        testDeclareImportConfig: function() {
            var Class = AFrame.Class( AFrame.AObject, {
                importconfig: [ 'blue' ]
            } );
            
            var SubClass = AFrame.Class( Class, {
                importconfig: [ 'green', 'indigo' ]
            } );
            
            var instance = AFrame.create( SubClass, {
                blue: 'blueish',
                green: 'greenish',
                indigo: 'indigoish',
                yellow: 'yellowish'
            } );
            
            Assert.areEqual( 'blueish', instance.blue, 'blue imported correctly' );
            Assert.areEqual( 'greenish', instance.green, 'green imported correctly' );
            Assert.areEqual( 'indigoish', instance.indigo, 'indigo imported correctly' );
            Assert.isUndefined( instance.yellow, 'yellow not imported' );
        },
        
        testDeclareBindings: function() {
            var event1HandlerCalled = false;
            var Class = AFrame.Class( AFrame.AObject, {
                importconfig: [ 'insertedObj' ],
                events: {
                    'event1 insertedObj': function() {
                        event1HandlerCalled = true;
                    }
                }
            } );
            
            
            var inserted = AFrame.create( AFrame.AObject );
            var instance = AFrame.create( Class, {
                insertedObj: inserted
            } );
            
            inserted.triggerEvent( 'event1' );
            Assert.isTrue( event1HandlerCalled, 'the handler on inserted\'s event is called' )
        }
} );
	
	