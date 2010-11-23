testsToRun.push( function testDisplay( Y ) {
	var TestRunner = Y.Test.Runner;
	var Assert = Y.Assert;
	var TestCase = Y.Test.Case;
	
	var test = new TestCase( {
		
		name: "TestCase AFrame.Display",
		
		setUp: function() {
			this.display = AFrame.construct( {
				type: AFrame.Display,
				config: {
					target: '.target'
				}
			} );
		},
		
		tearDown : function () {
			this.display.teardown();
			this.display = null;
			delete this.display;
		},

		testInitNoTarget: function() {
			var except;
			try {
				var display = AFrame.construct( {
					type: AFrame.Display
				} );
			} catch ( e ) {
				except = e;
			}

			Assert.areEqual( 'invalid target', except, 'invalid target exception correctly thrown' );
		},

		testGetTarget: function() {
			var target = this.display.getTarget();
			Assert.areSame( target[ 0 ], $( '.target' )[ 0 ], 'correct target' );
		},
		
		testBindDOM: function() {
			this.callbackCount = 0;

			var onClick = function( event ) {
				event.preventDefault();
				this.callbackCount++;
			};
			
			var id = this.display.bindDOMEvent( '.button', 'click', onClick, this );

			$( '.button' ).trigger( 'click' );
			Assert.areEqual( 1, this.callbackCount, 'event callback triggered' );
			Assert.isNotUndefined( id, 'id is defined' );
			
			$( '.target' ).trigger( 'click' );
			Assert.areEqual( 1, this.callbackCount, 'event bound to correct child item' );
		},

		testBindDOMOutsideTarget: function() {
			this.callbackCount = 0;
			
			var onClick = function( event ) {
				event.preventDefault();
				this.callbackCount++;
			};
			
			this.display.bindDOMEvent( $( '#externalButton' ), 'click', onClick, this );
			Assert.areEqual( 0, this.callbackCount, 'external target correct' );
		},

		testUnbindDOM: function() {
			this.callbackCount = 0;
			this.callbackCount2 = 0;
			var onClick = function( event ) {
				event.preventDefault();
				this.callbackCount2++;
			};
			
			var id = this.display.bindDOMEvent( '.button', 'click', onClick, this );
			this.display.unbindDOMEvent( id );
			$( '.button' ).trigger( 'click' );
			
			Assert.areEqual( 0, this.callbackCount2, 'event callback correctly unbound' );
			
			Assert.areEqual( 0, this.callbackCount, 'event callback correctly unbound on teardown' );
		},
		
		testBindClick: function() {
			this.callbackCount = 0;
			var defaultPrevented = false;
			var onClick = function( event ) {
				this.callbackCount++;
				defaultPrevented = event.isDefaultPrevented();
			};
			this.display.bindClick( '.button', onClick, this );

			$( '.button' ).trigger( 'click' );
			Assert.areEqual( 1, this.callbackCount, 'event callback triggered' );
			Assert.isTrue( defaultPrevented, 'default has been prevented' );
			
		},
		
		testGetDOMElement: function() {
			var domElement = this.display.getDOMElement();
			
			Assert.isObject( domElement, 'got an object' );
			Assert.isTrue( 'nodeType' in domElement, 'it has a nodeType, good enough' );
		}

	} );

	TestRunner.add( test );
} );