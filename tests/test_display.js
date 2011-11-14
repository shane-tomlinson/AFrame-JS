testsToRun.push( {

		name: "TestCase AFrame.Display",

		setUp: function() {
			this.display = AFrame.Display.create( {
         target: '.target'
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
				var display = AFrame.Display.create();
			} catch ( e ) {
				except = e;
			}

			Assert.areEqual( 'invalid target', except, 'invalid target exception correctly thrown' );
		},

		testGetTarget: function() {
			var target = this.display.getTarget();
			Assert.areSame( target[ 0 ], jQuery( '.target' )[ 0 ], 'correct target' );
		},

		testBindDOM: function() {
			this.callbackCount = 0;

			var onClick = function( event ) {
				event.preventDefault();
				this.callbackCount++;
			};

			var id = this.display.bindDOMEvent( '.button', 'click', onClick, this );

			AFrame.DOM.fireEvent( '.button', 'click' );
			Assert.areEqual( 1, this.callbackCount, 'event callback triggered' );
			Assert.isNotUndefined( id, 'id is defined' );

			AFrame.DOM.fireEvent( '.target', 'click' );
			Assert.areEqual( 1, this.callbackCount, 'event bound to correct child item' );
		},

    testBindDOMOnTarget: function() {
			this.callbackCount = 0;

			var onClick = function( event ) {
				event.preventDefault();
				this.callbackCount++;
			};

			var id = this.display.bindDOMEvent( '.target', 'click', onClick, this );

			AFrame.DOM.fireEvent( '.target', 'click' );
			Assert.areEqual( 1, this.callbackCount, 'event callback triggered' );
    },

		testBindDOMOutsideTarget: function() {
			this.callbackCount = 0;

			var onClick = function( event ) {
				event.preventDefault();
				this.callbackCount++;
			};

			this.display.bindDOMEvent( AFrame.DOM.getElements( '#externalButton' ), 'click', onClick, this );
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
			AFrame.DOM.fireEvent( '.button', 'click' );

			Assert.areEqual( 0, this.callbackCount2, 'event callback correctly unbound' );

			Assert.areEqual( 0, this.callbackCount, 'event callback correctly unbound on teardown' );
		},

		testBindClick: function() {
			this.callbackCount = 0;
			var defaultPrevented = false;
			var onClick = function( event ) {
				this.callbackCount++;
				defaultPrevented = event.isDefaultPrevented && event.isDefaultPrevented();
			};
			this.display.bindClick( '.button', onClick, this );

			AFrame.DOM.fireEvent( '.button', 'click' );
			Assert.areEqual( 1, this.callbackCount, 'event callback triggered' );
			Assert.isTrue( defaultPrevented, 'default has been prevented' );

		},

    testBindClickNoContext: function() {
      var context;
			var onClick = function( event ) {
                context = this;
			};
			this.display.bindClick( '.button', onClick );

			AFrame.DOM.fireEvent( '.button', 'click' );
			Assert.areEqual( this.display, context, 'context correctly set to object when no context given' );
    },

		testGetDOMElement: function() {
			var domElement = this.display.getDOMElement();

			Assert.isObject( domElement, 'got an object' );
			Assert.isTrue( 'nodeType' in domElement, 'it has a nodeType, good enough' );
		},

        testRender: function() {
			var display = new AFrame.Display();

            var renderEvent = false;
            display.bindEvent( 'onRender', function( display ) {
                renderEvent = true;
            } );

            // create a new display but override its render function.
            display.render = function() {
                AFrame.DOM.setInner( this.getTarget(), 'rendered inside of target' );
                AFrame.Display.prototype.render.call( this );
            };

            display.init( {
                target: '.target'
            } );

            Assert.areEqual( 'rendered inside of target', jQuery( '.target' ).html(), 'target was rendered' );
            Assert.isTrue( renderEvent, 'onRender was called' );
        },

        testDeclareDOMEventsNoSelector: function() {
            var inlineEvent, outlineEvent, onMouseOverCalled;
            var Display = AFrame.Display.extend( {
                domevents: {
                    click: [ function( event ) {
                        inlineEvent = event.type;
                    }, 'onClick' ],
                    mouseover: 'onMouseOver'
                },

                onClick: function( event ) {
                    outlineEvent = event.type;
                },

                onMouseOver: function( event ) {
                    onMouseOverCalled = true;
                }
            } );

            var instance = Display.create( {
                target: '.target'
            } );
            $( '.target' ).trigger( 'click' );

            Assert.areEqual( 'click', inlineEvent, 'inline click handler called' );
            Assert.areEqual( 'click', outlineEvent, 'outline click handler called' );

            $( '.target' ).trigger( 'mouseover' );
            Assert.isTrue( onMouseOverCalled, 'onMouseOver called' );
        },

        testDeclareDOMEventsWithSelector: function() {
            var onClickCalled;
            var Display = AFrame.Display.extend( {
                domevents: {
                    'click .buttonContainer #externalButton': 'onClick'
                },

                onClick: function( event ) {
                    onClickCalled = true;
                }
            } );

            var instance = Display.create( {
                target: '#AFrame_Display'
            } );
            $( '#externalButton' ).trigger( 'click' );

            Assert.isTrue( onClickCalled, 'onClickCalled called' );
        },

        testDeclareEventsWithInheritance: function() {
            var clickCount = 0;
            var Super = AFrame.Display.extend( {
                domevents: {
                    'click .buttonContainer #externalButton': 'onClick'
                },

                onClick: function( event ) {
                    clickCount++;
                }
            } );
			var Sub = Super.extend();

            var instance = Sub.create( {
                target: '#AFrame_Display'
            } );
            $( '#externalButton' ).trigger( 'click' );

            Assert.areEqual( 1, clickCount, 'click only called once' );
        },

        'init with bindEvents set to false, bindDOMEvents, unbindDOMEvents': function() {
          var clickCount = 0;
          var Display = AFrame.Display.extend( {
              domevents: {
                  'click .buttonContainer #externalButton': 'onClick'
              },

              onClick: function( event ) {
                  clickCount++;
              }
          } );

          var display = Display.create( {
              target: '#AFrame_Display',
              bindEvents: false
          } );

          $( '#externalButton' ).trigger( 'click' );
          Assert.areEqual( 0, clickCount, 'click not called' );

          display.bindDOMEvents();
          $( '#externalButton' ).trigger( 'click' );
          Assert.areEqual( 1, clickCount, 'click called after events bound' );

          display.unbindDOMEvents();
          $( '#externalButton' ).trigger( 'click' );
          Assert.areEqual( 1, clickCount, 'click not called after events unbound' );
        }
} );
