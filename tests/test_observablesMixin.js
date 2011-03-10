testsToRun.push( {

		name: "TestCase AFrame.ObservablesMixin",

		setUp: function() {
			this.eventSource = {};
			// we can add events to an object that doesn't natively support it
			AFrame.mixin( this.eventSource, AFrame.ObservablesMixin );
		},

		teardDown: function() {
			this.eventSource = null;
		},
		
		testBindTriggerEvent: function() {
			var callbackCalled = false;
			var callback = function() {
				callbackCalled = true;
			};
			
			var callbackWithContext = function( event, extra1, extra2 ) {
				this.callbackCalled = true;
				this.args = Array.prototype.slice.call( arguments, 0 );
			};
			
			this.eventSource.bindEvent( 'onCallback', callback );
			this.eventSource.bindEvent( 'onCallback', callbackWithContext, this );
			
			var event = this.eventSource.triggerEvent( 'onCallback', 1, 2 );
			
			Assert.isTrue( callbackCalled, 'callback bound & called' );
			Assert.isTrue( this.callbackCalled, 'callback bound & called with context' );
			
			Assert.isArray( this.args, 'arguments passed correctly with trigger' );
			Assert.areEqual( 'onCallback', this.args[ 0 ].type, 'event with type is first item passed' );
			Assert.areEqual( 1, this.args[ 1 ], 'arguments passed correctly with trigger' );
			Assert.areEqual( 2, this.args[ 2 ], 'arguments passed correctly with trigger' );
            
            Assert.isTrue( event instanceof AFrame.Event, 'the returned event is an Event object' );
			
		},
		
		testUnbindEvent: function() {
			callbackCalled = false;
			var callback = function() {
				callbackCalled = true;
			};
			
			var callbackID = this.eventSource.bindEvent( 'onCallback', callback );
			this.eventSource.unbindEvent( callbackID );
			
			this.eventSource.triggerEvent( 'onCallback' );
			Assert.isFalse( callbackCalled, 'callback unbound with ID' );
		},

		testUnbindAll: function() {	
			callbackCalled = false;
			var callback = function() {
				callbackCalled = true;
			};
			
			this.eventSource.bindEvent( 'onCallback', callback );
			this.eventSource.unbindAll();

			this.eventSource.triggerEvent( 'onCallback' );
			Assert.isFalse( callbackCalled, 'callback unbound with ID' );
		},
		
		testProxyEvents: function() {
			this.proxy = AFrame.create( AFrame.AObject );
			
			this.proxy.proxyEvents( this.eventSource, [ 'proxiedEvent' ] );
			
			var proxiedEvent, proxiedEventData;
			this.proxy.bindEvent( 'proxiedEvent', function( event, data ) {
                proxiedEvent = event;
				proxiedEventData = data;
			} );
			
			this.eventSource.triggerEvent( 'proxiedEvent', { proxiedField: 123 } );
			
			Assert.areEqual( 'proxiedEvent', proxiedEvent.type, 'proxied event type set correctly' );
			Assert.areEqual( this.proxy, proxiedEvent.target, 'target of proxied event set to proxy' );
			Assert.areEqual( this.eventSource, proxiedEvent.originalTarget, 'originalTarget of proxied event set to original target' );
			Assert.areEqual( 123, proxiedEventData.proxiedField, 'proxied event occured, correct data passed' );
		},

		testBindToUnbindToAll: function() {
			
			var bindToObject = AFrame.create( AFrame.AObject );
			
			var listenerCalls = 0;
			this.eventSource.listener = function() {
				listenerCalls++;
			};
			
			bindToObject.bindEvent( 'eventName', this.eventSource.listener, this.eventSource );
			
			bindToObject.triggerEvent( 'eventName' );
			Assert.areEqual( 1, listenerCalls, 'listener was called on another object' );
			
			this.eventSource.unbindToAll();
			bindToObject.triggerEvent( 'eventName' );
			Assert.areEqual( 1, listenerCalls, 'listener was not called after unbindToAll' );
		},
		
		testBindToUnbindTo: function() {
			
			var bindToObject = AFrame.create( AFrame.AObject );
			
			var listenerCalls = 0;
			this.eventSource.listener = function() {
				listenerCalls++;
			};
			
			var id = bindToObject.bindEvent( 'eventName', this.eventSource.listener, this.eventSource );
			
			bindToObject.triggerEvent( 'eventName' );
			Assert.areEqual( 1, listenerCalls, 'listener was called on another object' );
			
			this.eventSource.unbindTo( id );
			bindToObject.triggerEvent( 'eventName' );
			Assert.areEqual( 1, listenerCalls, 'listener was not called after unbindTo' );
		},
        
        testGetEventObject: function() {
            this.eventSource.setEventData( {
                type: 'event'
            } );
            var event = this.eventSource.getEventObject();
            
            Assert.areEqual( this.eventSource, event.target, 'event target is set' );
            Assert.isTrue( event.timestamp instanceof Date, 'event timestamp is a date' );
        },
        
        testSetEventData: function() {
            this.eventSource.setEventData( {
                eventField: 'eventValue',
                secondField: 'secondValue',
                type: 'event'
            } );
            
            var event = this.eventSource.getEventObject();
            Assert.areEqual( 'eventValue', event.eventField, 'eventField is added' );
            Assert.areEqual( 'secondValue', event.secondField, 'multiple fields are added' );
            /*
            event = this.eventSource.getEventObject();
            Assert.isUndefined( event.eventField, 'eventField is undefined on the second call to getEventObject' );
            Assert.isUndefined( event.secondField, 'secondField is undefined on the second call to getEventObject' );
*/
            this.eventSource.setEventData( {
                eventField: 'eventValue',
                secondField: 'secondValue'
            } );
            this.eventSource.setEventData( {
                thirdField: 'thirdValue',
                type: 'event'
            } );

            event = this.eventSource.getEventObject();
            Assert.areEqual( 'eventValue', event.eventField, 'eventField is added' );
            Assert.areEqual( 'secondValue', event.secondField, 'multiple fields are added' );
            Assert.areEqual( 'thirdValue', event.thirdField, 'consecutive calls to setEventData add all data' );
            
        },
        
        testTriggerWithDataObject: function() {
            var eventData;
            this.eventSource.bindEvent( 'event', function( event ) {
                eventData = event;
            } );
            
            this.eventSource.triggerEvent( {
                type: 'event'
            } );
            
            Assert.areEqual( 'event', eventData.type, 'event triggered with event object' );
        }
        
        
        
} );
