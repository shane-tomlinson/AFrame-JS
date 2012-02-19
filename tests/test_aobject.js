(function() {
	var aobject;

	testsToRun.push( {

			name: "TestCase AFrame.AObject",

			setUp: function() {
				aobject = new AFrame.AObject();
			},

			tearDown : function () {
				aobject.teardown();
				aobject = null;
			},

			testInit: function() {
				aobject.init( {
					configVal: true
				} );

				var objectConfig = aobject.getConfig();
				Assert.isTrue( objectConfig.configVal, 'configuration correctly set' );
			},

			testCIDSetInConfig: function() {
				aobject.init( {
					cid: 'testcid'
				} );

				Assert.areEqual( 'testcid', aobject.getCID(), 'CID assigned correctly' );
			},

			testCIDAssigned: function() {
				aobject.init( {} );

				Assert.isNotUndefined( aobject.getCID(), 'CID assigned automatically' );
			},

      testCheckRequiredNoneMissing: function() {
        var error;
        try {
            aobject.checkRequired({ key: "value" }, "key");
        }
        catch(e) {
          error = e;
        }

        Assert.isUndefined(error, "all options available, no error");
      },

      testCheckRequiredMissingOption: function() {
        var error;
        try {
            aobject.checkRequired({}, "key");
        }
        catch(e) {
          error = e;
        }

        Assert.areEqual(error, "missing config option: key");
      },

			testIsTriggeredNoListener: function() {
				Assert.isFalse( aobject.isEventTriggered( 'onInit' ), 'onInit event not triggered' );
				var callback = function() {};

				aobject.init( {
					configVal: true
				} );

				Assert.isFalse( aobject.isEventTriggered( 'onInit' ), 'onInit event not triggered, no listener' );

			},

			testIsTriggeredListener: function() {
				Assert.isFalse( aobject.isEventTriggered( 'onInit' ), 'onInit event not triggered' );
				var callback = function() {};

				aobject.bindEvent( 'onInit', callback );
				aobject.init( {
					configVal: true
				} );

				Assert.isTrue( aobject.isEventTriggered( 'onInit' ), 'onInit event triggered' );
			},

			testTriggerEvent: function() {
				var triggeredEvent, extraParam = true;
				var callback = function( event, extra ) {
					triggeredEvent = event;
					extraParam = extra;
				};

				aobject.bindEvent( 'onInit', callback );
				aobject.triggerEvent( 'onInit' );

				Assert.areEqual( 'onInit', triggeredEvent.type, 'triggeredEvent type is set' );
				Assert.areEqual( aobject, triggeredEvent.target, 'triggeredEvent target is set' );
				Assert.isUndefined( extraParam, 'extraParam is undefined' );

				aobject.triggerEvent( 'onInit', 'blue' );
				Assert.areEqual( 'blue', extraParam, 'extraParam is set to blue' );
			},

			testTriggerProxy: function() {
				var proxy = aobject.triggerProxy( 'proxiedEvent' );

				var eventTriggered = false;
				aobject.bindEvent( 'proxiedEvent', function() {
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

				aobject.init( {} );
				aobject.addChild( objectToTeardown );
				aobject.teardown();
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

				aobject.init( {} );
				aobject.addChild( objectToRemove );
				aobject.removeChild( 1 );
				aobject.teardown();
				Assert.isFalse( tornDown, 'child\'s teardown not called since it was already removed' );
			},

			testDeclareImportConfig: function() {
				var Class = AFrame.AObject.extend( {
					importconfig: [ 'blue' ]
				} );

				var SubClass = Class.extend( {
					importconfig: [ 'green', 'indigo' ]
				} );

				var instance = SubClass.create( {
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
				var Class = AFrame.AObject.extend( {
					importconfig: [ 'insertedObj' ],
					events: {
						'event1 insertedObj': function() {
							event1HandlerCalled = true;
						}
					}
				} );


				var inserted = AFrame.AObject.create();
				var instance = Class.create( {
					insertedObj: inserted
				} );

				inserted.triggerEvent( 'event1' );
				Assert.isTrue( event1HandlerCalled, 'the handler on inserted\'s event is called' )
			},

			testDeclarBindingsWithInheritance: function() {
				var eventCallCount = 0;
				var Super = AFrame.AObject.extend( {
					importconfig: [ 'insertedObj' ],
					events: {
						'event1 insertedObj': function() {
							eventCallCount++;
						}
					}
				} );

				var Sub = Super.extend();

				var inserted = AFrame.AObject.create();
				var instance = Sub.create( {
					insertedObj: inserted
				} );

				inserted.triggerEvent( 'event1' );
				Assert.areEqual( 1, eventCallCount, 'the handler was called once.' )

			}
	} );


}());
