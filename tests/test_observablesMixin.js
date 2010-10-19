
function testObservablesMixin( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;

	var test = new TestCase( {

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
			
			var callbackWithContext = function() {
				this.callbackCalled = true;
				this.args = Array.prototype.slice.call( arguments, 0 );
			};
			
			this.eventSource.bindEvent( 'onCallback', callback );
			this.eventSource.bindEvent( 'onCallback', callbackWithContext, this );
			
			this.eventSource.triggerEvent( 'onCallback', 1, 2 );
			
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
			
			var callbackID = this.eventSource.bindEvent( 'onCallback', callback );
			this.eventSource.unbindEvent( 'onCallback', callbackID );
			
			this.eventSource.triggerEvent( 'onCallback' );
			Assert.isFalse( callbackCalled, 'callback unbound with ID' );
		},
		
		testProxyEvents: function() {
			this.proxy = AFrame.construct( {
				type: 'AFrame.AObject'
			} );
			
			this.proxy.proxyEvents( this.eventSource, [ 'proxiedEvent' ] );
			
			var proxiedEventData;
			this.proxy.bindEvent( 'proxiedEvent', function( data ) {
				proxiedEventData = data;
			} );
			
			this.eventSource.triggerEvent( 'proxiedEvent', { proxiedField: 123 } );
			
			Assert.areEqual( 123, proxiedEventData.proxiedField, 'proxied event occured, correct data passed' );
		}
	} );

	TestRunner.add( test );
}
