
(function() {
	var SuperClass = AFrame.Class( {
		hasFunc: function() {
			return true;
		},

		sharedFunc: function() {
			this.sharedFuncCalled = true;
			return true;
		}
	} );

	var SubClass = SuperClass.extend( {
		superExtendedFunc: function() {
		return true;
		},

		sharedFunc: function() {
		return SubClass.sc.sharedFunc.call( this );
		},

		init: function() {
		  this.initCalled = true;
		},

		itemToRemove: true
	}, {
		funcsFromSecondMixin: function() {
		}
	} );

	var A = {
		SubClass: function() {
		this.init = function() {};
		return true;
		}
	};


	testsToRun.push( {
			name: "TestCase AFrame.mixin",

			setUp : function () {
				this.subInstance = new SubClass();
				this.mixed = AFrame.mixin( this.subInstance, {
					mixedFunction: function() {
					return true;
					}
				} );
			},

			tearDown : function () {
				this.subInstance = null;
				delete this.subInstance;
			},

			testMixin: function() {
				Assert.isFunction( this.subInstance.mixedFunction, 'mixedFunction added' );
				Assert.isTrue( this.subInstance.mixedFunction(), 'mixedFunction can be called' );
				Assert.areSame( this.subInstance, this.mixed, 'AFrame.mixin returns object mixed into' )
			}
	} );

	testsToRun.push( {
			name: "TestCase AFrame.remove",

			setUp : function () {
				this.subInstance = new SubClass();
			},

			tearDown : function () {
				this.subInstance = null;
				delete this.subInstance;
			},

			testRemove: function() {
				Assert.isTrue( this.subInstance.itemToRemove, 'itemToRemove exists' );
				AFrame.remove( this.subInstance, 'itemToRemove' );
				Assert.isFalse( this.subInstance.hasOwnProperty( 'itemToRemove' ), 'item is removed' );
			}
	} );


	testsToRun.push( {
		name: 'TestCase AFrame.create',
		testCreateNoConfig: function() {
			var instance = AFrame.create( SubClass );

			Assert.isTrue( instance instanceof SubClass, 'instance is an instance of subclass' );
			Assert.isTrue( instance.initCalled, 'init is called' );
		},

		testCreateConfig: function() {
			var config = {};
			var instance = AFrame.create( AFrame.AObject, config );

			Assert.areSame( config, instance.getConfig(), 'config passed to init' );
		},

		testCreateWithPluginInArray: function() {
			var initPluginConfig;
			var setPluggedPlugged;

			var PluginMock = function() {};
			PluginMock.prototype = {
				init: function( config ) {
					initPluginConfig = config;
					setPluggedPlugged = config.plugged;
				}
			}

			var pluginConfig = {};
			var config = {
				plugins: [ [ PluginMock, pluginConfig ] ]
			};

			var instance = AFrame.create( AFrame.AObject, config );

			Assert.areSame( instance, setPluggedPlugged, 'setPlugged called with new object' );
		},

		testCreateWithPlugin: function() {
			var pluginInitCalled;
			var setPluggedPlugged;

			var PluginMock = function() {};
			PluginMock.prototype = {
				init: function( config ) {
					pluginInitCalled = true;
					setPluggedPlugged = config.plugged;
				}
			}

			var config = {
				plugins: [ PluginMock ]
			};

			var instance = AFrame.AObject.create( config );

			Assert.isTrue( pluginInitCalled, 'plugin\'s init is called' );
		},

		testCreateWithClassPlugins: function() {
			var pluginInitCalled;
			var setPluggedPlugged;

			var PluginMock = function() {};
			PluginMock.prototype = {
				init: function( config ) {
					pluginInitCalled = true;
					setPluggedPlugged = config.plugged;
				}
			}

			var Class = AFrame.Class( AFrame.AObject, {
				plugins: [ PluginMock ]
			} );

			var instance = Class.create();

			Assert.isTrue( pluginInitCalled, 'plugin\'s init is called' );
		}
	} );

	testsToRun.push( {
			name: 'TestCase AFrame general functions',

			testGetUniqueID: function() {
				var id1 = AFrame.getUniqueID();
				var id2 = AFrame.getUniqueID();

				Assert.areNotEqual( id1, id2, 'ids are unique' );
			},

			testLog: function() {
				if( window.console ) {
					var logMessage;
					window.console.log = function( message ) {
						logMessage = message;
					};

					AFrame.log( 'message to log' );

					Assert.areEqual( 'message to log', logMessage, 'window.console called with right message' );
				}
				else {
					var except;
					try {
						AFrame.log( 'message to log' );
					}
					catch( e ) {
						except = e;
					}

					Assert.isUndefined( except, 'safe even if window.console does not exist' );
				}
			}
	} );

	testsToRun.push( {
		name: 'TestCase Type Check Functions',

		testDefined: function() {
			Assert.isFalse( AFrame.defined(), 'undefined value' );
			Assert.isTrue( AFrame.defined( '1' ), 'defined value' );
		},

		testFunc: function() {
			Assert.isFalse( AFrame.func('1'), 'not a function' );

			var testFunc = function() {
			};

			Assert.isTrue( AFrame.func( testFunc ), 'a function' );
		},

		testString: function() {
			Assert.isFalse( AFrame.string( 1 ), '1 is not a string' );
			Assert.isTrue( AFrame.string( 'testString' ), 'a string' );
			Assert.isTrue( AFrame.string( new String( 'testString' ) ), 'a string' );
		},

		testArray: function() {
			Assert.isFalse( AFrame.array( 1 ), '1 is not an array' );
			Assert.isTrue( AFrame.array( [] ), '[] is not an array' );
			Assert.isTrue( AFrame.array( new Array() ), 'new Array creates an array' );
		}
	} );
}());
