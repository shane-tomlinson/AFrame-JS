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
		name: 'TestCase AFrame.Class',

		setUp : function () {
			this.subInstance = SubClass.create();
		},

		tearDown : function () {
			this.subInstance = null;
			delete this.subInstance;
		},

		testNewClassNoBase: function() {
			var proto = {
				init: function() {
				}
			};
			var Class = AFrame.Class( proto );

			Assert.isFunction( Class );
			Assert.areSame( Class, Class.prototype.constructor, 'prototype constructor is set' );
			Assert.areSame( proto.init, Class.prototype.init, 'init uses the init we defined' );
		},

		testNewClassBase: function() {
			var proto = {
				init: function() {}
			};

			var constCalled = false;
			function MockBase() {
				constCalled = true;
			}
			MockBase.prototype = {
				constructor: MockBase,
				init: function() {
				}
			};

			var Class = AFrame.Class( MockBase, proto );
			Assert.isFunction( Class );
			Assert.isTrue( Class === Class.prototype.constructor, 'prototype constructor is set' );
			Assert.areSame( proto.init, Class.prototype.init, 'init uses the init we defined' );

			var instance = Class.create();

			Assert.isTrue( instance instanceof MockBase, 'new class is instance of AObject' );
			Assert.isTrue( constCalled, 'base constructor is called' );
		},

		testNewClassMultipleMixins: function() {
			var mixin1 = {
				init: function() {}
			};

			var mixin2 = {
				func2: function() {}
			};

			var Class = AFrame.Class( mixin1, mixin2 );

			Assert.isFunction( Class.prototype.init, 'init added to Class' );
			Assert.isFunction( Class.prototype.func2, 'func2 added to Class' );

		},

		testWalkChain: function() {
			var instance = SubClass.create(), depth = 0;
			AFrame.Class.walkChain( function( currClass ) {
				depth++;
			}, instance );

			Assert.areEqual( 2, depth, 'SubClass has a class depth of 2' );
		},

		testClassCreate: function() {
			var Class = AFrame.AObject.extend( {
				importconfig: [ 'color' ],
				getColor: function() {
					return this.color;
				}
			} );

			var inst = Class.create( { color: 'green' } );
			Assert.isTrue( inst instanceof Class, 'Class created with Class.create()' );
			Assert.areEqual( 'green', inst.getColor(), 'options passed to constructor' );
		},

		testClassCreateNotAddedIfNoInit: function() {
			var Class = AFrame.Class( {
				importconfig: [ 'color' ],
				getColor: function() {
					return this.color;
				}
			} );
			Assert.isUndefined( Class.create, 'create not added to Class without init' );
		},

		testClassWithConstructorSpecified: function() {
			var constCalled = false;

			var Class = AFrame.AObject.extend( {
				constructor: function() {
					constCalled = true;
				}
			} );

			var inst = Class.create();

			Assert.isTrue( constCalled, 'The constructor was specified and called' );
		},

		testWithConstructorAndNoBaseClass: function() {
			var constCalled = false;

			var Class = AFrame.Class( {
				constructor: function() {
					constCalled = true;
				},
				init: function() {

				}
			} );

			var inst = Class.create();

			Assert.isTrue( constCalled, 'The constructor was specified and called' );
		},

		testExtend: function() {
			Assert.isFunction( AFrame.AObject.extend, 'extend added to AObject' );

			var Class = AFrame.AObject.extend( {} );

			Assert.isTrue( AFrame.extendsFrom( Class, AFrame.AObject ), 'Class extends from AFrame.AObject' );

			var inst = Class.create();
			Assert.isTrue( inst instanceof AFrame.AObject, 'subclass is instanceof superclass' );
		},

		testExtendSuperclass: function () {
			Assert.isFunction( this.subInstance.hasFunc, 'superExtendedFunc exists' );
			Assert.isTrue( this.subInstance.hasFunc(), 'subclass function returns true' );
			Assert.isObject( SubClass.sc, 'sc exists' );
			Assert.areEqual( SubClass.sc.hasFunc, SuperClass.prototype.hasFunc, 'sc points to super\'s function' );

			Assert.isFunction( this.subInstance.funcsFromSecondMixin, 'extend works with more than one mixin' );
		},

		testExtendExtraFuncs: function () {
			Assert.isFunction( this.subInstance.superExtendedFunc, 'superExtendedFunc exists' );
			Assert.isTrue( this.subInstance.superExtendedFunc(), 'superExtendedFunc returns correctly' );
		},

		testExtendSuperclassInheritedFuncCall: function () {
			Assert.isTrue( this.subInstance.sharedFunc(), 'sharedFunc calls super class' );
			Assert.isTrue( this.subInstance.sharedFuncCalled, 'sharedFunc calls super class sets value' );
		},

		testCheckExtendsFrom: function() {
			var doesExtend = AFrame.extendsFrom( SubClass, SuperClass );
			Assert.isTrue( doesExtend, 'SubClass inherits from SuperClass' );

			doesExtend = AFrame.extendsFrom( SuperClass, SubClass );
			Assert.isFalse( doesExtend, 'SuperClass does not extend from SubClass' );
		},

	} );

}());
