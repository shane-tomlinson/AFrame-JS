testsToRun.push( {
		
		name: "TestCase AFrame.Event",
		
		setUp: function() {
            this.event = AFrame.Event.createEvent( 'event' );
		},
		
		tearDown: function () {
            this.event = null;
		},
        
        testEvent: function() {
            var event = this.event;
            
            Assert.areEqual( 'event', event.type, 'event.type set correctly to event' );
            Assert.isTrue( event.timestamp instanceof Date, 'event.timestamp is a date' );
        },
        
        testPreventDefault: function() {
            var event = this.event;
            
            Assert.isFalse( event.isDefaultPrevented(), 'default has not yet been prevented' );
            
            event.preventDefault();
            Assert.isTrue( event.isDefaultPrevented(), 'default has been prevented' );
        },
        
        testCreateEventWithObject: function() {
            var event = AFrame.Event.createEvent( {
                type: 'event',
                target: this,
                extraField: 'extraValue'
            } );
            
            Assert.areEqual( 'event', event.type, 'type correctly set' );
            Assert.areEqual( this, event.target, 'target correctly set' );
            Assert.areEqual( 'extraValue', event.extraField, 'extraField correctly set' );
            Assert.isTrue( event.timestamp instanceof Date, 'timestamp set' );
        },
        
        testEventNoType: function() {
            var error;
            
            try {
                var event = AFrame.Event.createEvent( {
                    target: this,
                    extraField: 'extraValue'
                } );
            } catch ( e ) {
                error = e;
            }
            
            Assert.areEqual( 'Event type undefined', error, 'no type error was thrown for createEvent with object' );

            error = undefined;
            
            try {
                var event = AFrame.Event.createEvent();
            } catch ( e ) {
                error = e;
            }
            
            Assert.areEqual( 'Event type undefined', error, 'no type error was thrown for createEvent with no arguments' );

            error = undefined;
            
            try {
                var event = AFrame.Event.createEvent( '' );
            } catch ( e ) {
                error = e;
            }
            
            Assert.areEqual( 'Event type undefined', error, 'no type error was thrown for createEvent with empty string' );
        },
        
        testProxyEventNoTarget: function() {
            var proxy = {};
            this.event.proxyEvent( proxy );
            
            Assert.areEqual( proxy, this.event.target, 'event successfully proxied' );
            Assert.isUndefined( this.event.originalTarget, 'originalTarget undefined' );
            
            var secondProxy = {};
            this.event.proxyEvent( secondProxy );
            Assert.areEqual( secondProxy, this.event.target, 'event successfully proxied to second proxy' );
            Assert.isUndefined( this.event.originalTarget, 'originalTarget undefined' );
        },
        
        testProxyEventTarget: function() {
            var event = AFrame.Event.createEvent( {
                target: this,
                type: 'event'
            } );
            
            var proxy = {};
            event.proxyEvent( proxy );
            Assert.areEqual( proxy, event.target, 'event successfully proxied' );
            Assert.areEqual( this, event.originalTarget, 'originalTarget set to this' );

            var secondProxy = {};
            event.proxyEvent( secondProxy );
            Assert.areEqual( secondProxy, event.target, 'event successfully proxied to second proxy' );
            Assert.areEqual( this, event.originalTarget, 'originalTarget still set to this' );
        }


} );
